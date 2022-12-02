const express = require("express");
const db = require("../../db");
const bodyParser = require("body-parser");
const cart_item = require("../cart_items/cart_items");

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
    const cart_ordersById = await db.query(
      `WITH cart_order AS (
            SELECT 
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
               WHERE carts.user_id = $1
              )
              SELECT
                book_id,
                quantity,             
                price * quantity AS total
              FROM cart_order
              ORDER BY book_id`,
      [req.params.userId]
    );
    console.log(cart_ordersById.rows);
    cart_ordersById.rows.forEach((order) => {
      db.query(
        `INSERT INTO order_books
            (book_id, quantity, item_total)
            VALUES ($1, $2, $3)
            RETURNING *`,
        [order.book_id, order.quantity, order.total]
      );
    });
  }
});

module.exports = carts;
