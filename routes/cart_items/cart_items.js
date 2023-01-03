const express = require("express");
const cart_items = express.Router({ mergeParams: true });
const db = require("../../db");

// Gets bookId params
cart_items.param("bookId", (req, res, next, id) => {
  const idToFind = Number(id);
  db.query(
    "SELECT * FROM cart_items WHERE book_id = $1",
    [idToFind],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length === 0) {
        res.status(404).send("Book not found");
      } else {
        req.bookIndex = results.rows[0].book_id;
        next();
      }
    }
  );
});

// Get a cartItem for a user by cartId and bookId
cart_items.get("/:bookId", (req, res, next) => {
  db.query(
    `SELECT 
	    books.title,
        books.author,
        books.price,
        cart_items.quantity
    FROM carts
    INNER JOIN cart_items
        ON carts.user_id = cart_items.user_id
    INNER JOIN books
        ON cart_items.book_id = books.id
    WHERE carts.user_id = $1
    AND cart_items.book_id = $2`,
    [req.user.id, req.params.bookId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length > 0) {
        res.status(200).json(results.rows);
      } else {
        res.status(404).send("Cart item not found");
      }
    }
  );
});

// Create a cart_item
cart_items.post("/", (req, res, next) => {
  const { bookId, quantity } = req.body;
  db.query(
    `INSERT INTO cart_items (user_id, book_id, quantity) VALUES ($1, $2, $3)`,
    [req.user.id, bookId, quantity],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(201).send("Added to cart!");
      }
    }
  );
});

// Modify quantity of order in a cart_item
cart_items.put("/:bookId", (req, res, next) => {
  const { quantity } = req.body;
  db.query(
    `UPDATE cart_items
    SET quantity = $1
    WHERE user_id = $2
    AND book_id = $3`,
    [quantity, req.user.id, req.params.bookId],
    (error, results) => {
      res.status(200).send("Cart order updated!");
    }
  );
});

// Remove cart_item (i.e a cart order)
cart_items.delete("/:bookId", (req, res, next) => {
  db.query(
    `DELETE FROM cart_items
        WHERE user_id = $1
        AND book_id = $2`,
    [req.user.id, req.params.bookId],
    (error, results) => {
      res.status(204);
    }
  );
});

module.exports = cart_items;
