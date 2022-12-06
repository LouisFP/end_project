const express = require("express");
const db = require("../../db");
const bodyParser = require("body-parser");
const cart_item = require("../cart_items/cart_items");
const e = require("express");
const orders = require("../orders/orders");

const carts = express.Router({ mergeParams: true });

carts.use(bodyParser.json());

carts.use("/:cartId/cart_items", cart_item);

// Get all carts (EXPAND this to all products from all carts later on!!)
// carts.get("/", (req, res, next) => {
//   db.query("SELECT * FROM carts", (error, results) => {
//     if (error) {
//       res.status(400).json({ message: error.message });
//     } else {
//       res.status(200).json(results.rows);
//     }
//   });
// });

// Gets a cart with all orders by userId (title, author, price, quantity)
carts.get("/", (req, res, next) => {
  userId = Number(req.params.userId);
  db.query(
    `SELECT 
        books.title, 
        books.author, 
        books.price, 
        cart_items.quantity 
    FROM carts
    INNER JOIN cart_items
        ON carts.id = cart_items.cart_id
    INNER JOIN books
        ON cart_items.book_id = books.id
    WHERE carts.user_id = $1`,
    [userId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length > 0) {
        res.status(200).json(results.rows);
      } else {
        res.status(404).send("User not found!");
      }
    }
  );
});

// Creates a cart
carts.post("/", (req, res, next) => {
  db.query(
    "INSERT INTO carts WHERE user_id = $1",
    [req.params.userId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(201).send("Cart created");
      }
    }
  );
});

// Check if cart is empty first (no cart_items)
const isEmpty = (req, res, next) =>
  db.query(
    `SELECT * FROM cart_items 
    WHERE cart_id = $1`,
    [req.params.cartId],
    (error, results) => {
      if (error) {
        console.log(results.rows.length);
        res.status(400).send(error.stack);
      } else if (results.rows.length) {
        res.send("The cart needs to be empty first!");
      } else {
        next();
      }
    }
  );

//Remove a cart
carts.delete("/:cartId", isEmpty, (req, res, next) => {
  db.query(
    `DELETE FROM carts
    WHERE id = $1`,
    [req.params.cartId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(204).send();
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
    WHERE cart_id = $1`,
    [req.params.cartId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length) {
        next();
      } else {
        res.send("This cart is empty!");
      }
    }
  );
};

// Checkpoint endpoint, validate if cart is empty, check payment credentials and add order if successful
carts.post("/:cartId/checkout", checkCartExistence, async (req, res, next) => {
  const { cardInfo } = req.body;
  if (true) {
    // Create order as cardinfo is correct
    orders.createOrder(req.params.userId);

    const cart_ordersById = await db.query(
      `WITH cart_order AS (
              SELECT
                    orders.id AS id,
                    books.title AS title,
                    books.author AS author,
                    books.price as price,
                    cart_items.quantity AS quantity,
                    cart_items.book_id AS book_id
                FROM carts
                INNER JOIN cart_items
                    ON carts.id = cart_items.cart_id
                INNER JOIN books
                    ON cart_items.book_id = books.id
                INNER JOIN users
                    ON carts.user_id = users.id
                INNER JOIN orders
                    ON orders.user_id = users.id
                 WHERE carts.user_id = $1
                 AND cart_items.cart_id = $2
                )
                SELECT
                  id,
                  book_id,
                  quantity,
                  price * quantity AS total
                FROM cart_order
                ORDER BY book_id`,
      [req.params.userId, req.params.cartId]
    );

    // Each card order is added into the order_books database for a given userId
    cart_ordersById.rows.forEach((order) => {
      db.query(
        `INSERT INTO order_books
            (order_id, book_id, quantity, item_total)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
        [order.id, order.book_id, order.quantity, order.total],
        (error, results) => {
          if (error) {
            // Delete order created above if this is not completely successful for each order
            orders.deleteOrder(order.id);
            res.write(error.stack);
            res.end();
            return;
          } else {
            res.write("Cart order added");
            res.end();
            //   Deletes all the cart_items so there will be no duplicates
            db.query(
              `DELETE FROM cart_items
                WHERE cart_id = $1
                AND book_id = $2`,
              [req.params.cartId, order.book_id],
              (error, results) => {
                if (error) {
                  res.write(error.stack);
                } else {
                  res.write("Cart order cleared!");
                }
                res.end();
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
        WHERE id = $1`,
      [req.params.cartId],
      (error, results) => {
        if (error) {
          res.write(error.message);
          res.end();
          return;
        }
        res.write("Cart deleted");
        res.end();
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
        (error, results) => {
          if (error) {
            console.log(error.message);
            res.write(error.message);
          } else {
            res.write("Order made");
          }
          res.end();
        }
      )
    );
  }
});

module.exports = carts;
