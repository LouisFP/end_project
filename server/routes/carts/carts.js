const express = require("express");
const db = require("../../db");
const bodyParser = require("body-parser");
const cart_item = require("../cart_items/cart_items");
const orders = require("../orders/orders");
const { isLoggedIn } = require("../../db/helper");

const carts = express.Router({ mergeParams: true });

carts.use(bodyParser.json());

carts.use("/cart_items", isLoggedIn, cart_item);

// Gets a user's cart (title, author, price, quantity)
carts.get("/", (req, res) => {
  db.query(
    `SELECT 
      id,
      user_id,
      book_id,
      quantity
    FROM cart_items  
    WHERE cart_items.user_id = $1`,
    [req.user.id],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length > 0) {
        console.log(results.rows);
        res.status(200).json(results.rows);
      } else if (results.rows.length === 0) {
        res.json({ message: "Your cart is empty!" });
      }
    }
  );
});

// Check to see if a user already has a cart
const hasCart = (req, res, next) => {
  db.query(
    `SELECT 
      * 
    FROM carts
    WHERE user_id = $1`,
    [req.user.id],
    (error, results) => {
      if (error) {
        res.status(400).send(error.message);
      }
      if (results.rows.length) {
        res.json({ message: "You already have a cart!" });
      } else {
        next();
      }
    }
  );
};

// Creates a cart for the user
carts.post("/", hasCart, (req, res) => {
  db.query(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING id, user_id",
    [req.user.id],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        console.log(results.rows.id);
        res.status(201).json({
          message: "Cart Created!",
          id: results.rows[0].id,
          user_id: results.rows[0].user_id,
        });
      }
    }
  );
});

// Check if cart is empty first (no cart_items)
const isEmpty = (req, res, next) =>
  db.query(
    `SELECT * FROM cart_items 
    WHERE user_id = $1`,
    [req.user.id],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length) {
        res.json({ message: "The cart needs to be empty first!" });
      } else {
        next();
      }
    }
  );

//Remove a cart, only the user's cart
carts.delete("/", isEmpty, (req, res) => {
  db.query(
    `DELETE FROM carts
    WHERE user_id = $1
    RETURNING id, user_id`,
    [req.user.id],
    (error, results) => {
      if (error) {
        res.status(400).send(error.message);
      } else {
        res.status(204).json({
          message: "Your cart has been deleted!",
          id: results.rows[0].id,
          user_id: results.rows[0].user_id,
        });
      }
    }
  );
});

// Check if a cart has items or not
const checkCartExistence = (req, res, next) => {
  db.query(
    `SELECT 
      * 
    FROM cart_items
    WHERE user_id = $1`,
    [req.user.id],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length) {
        next();
      } else {
        res.json({ message: "This cart is empty!" });
      }
    }
  );
};

// Checkpoint endpoint, validate if cart is empty, check payment credentials and add order if successful
carts.post("/checkout", checkCartExistence, async (req, res) => {
  // const { cardInfo } = req.body; ADD IN STRIPE
  if (true) {
    // Create order as cardinfo is correct
    orders.createOrder(req.user.id);

    const cart_ordersById = await db.query(
      `WITH cart_order AS (
        SELECT
              orders.id AS id,
              books.title AS title,
              books.author AS author,
              books.price as price,
              cart_items.quantity AS quantity,
              cart_items.book_id AS book_id
          FROM cart_items
          INNER JOIN books
              ON cart_items.book_id = books.id
          INNER JOIN users
              ON cart_items.user_id = users.id
          INNER JOIN orders
              ON orders.user_id = users.id
           WHERE cart_items.user_id = $1
          )
          SELECT
            id,
            book_id,
            quantity,
            price * quantity AS total
          FROM cart_order
          ORDER BY book_id`,
      [req.user.id]
    );

    // Each card order is added into the order_books database for the user
    cart_ordersById.rows.forEach((order) => {
      db.query(
        `INSERT INTO order_books
            (order_id, book_id, quantity, item_total)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
        [order.id, order.book_id, order.quantity, order.total],
        (error) => {
          if (error) {
            // Delete order created above if this is not completely successful for each order
            orders.deleteOrder(order.id);
            res.write(error.stack);
            return;
          } else {
            res.write("Card order added\n");
            //   Deletes all the cart_items so there will be no duplicates
            db.query(
              `DELETE FROM cart_items
                WHERE user_id = $1
                AND book_id = $2`,
              [req.user.id, order.book_id],
              (error) => {
                if (error) {
                  res.write(error.stack);
                } else {
                  res.write("Cart order cleared!\n");
                }
              }
            );
          }
        }
      );
    });
    //   If all successful delete the cart as well, if there has been an error
    //   above then cart won't be empty and an error will be thrown here
    db.query(
      `DELETE FROM carts
        WHERE user_id = $1`,
      [req.user.id],
      (error) => {
        if (error) {
          res.write(error.message);
          return;
        }
        res.write("Cart deleted\n");
      }
    );
    //   Now final part is adding order total to the order
    //   Setting order total
    db.query(
      `SELECT
           SUM(quantity * item_total)
        FROM order_books`
    ).then((result) =>
      // Adding into orders table
      db.query(
        `UPDATE orders
          SET order_total = $1
          WHERE id = $2`,
        [result.rows[0].sum, cart_ordersById.rows[0].id],
        (error) => {
          if (error) {
            res.write(error.message);
          } else {
            res.write("Order made\n");
          }
          res.end();
        }
      )
    );
  }
});

module.exports = carts;
