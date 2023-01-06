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
        res.status(404).json({ message: "Book not found" });
      } else {
        req.bookIndex = results.rows[0].book_id;
        next();
      }
    }
  );
});

// Get a cartItem for a user by bookId
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
        res.status(404).json({ message: "Cart item not found" });
      }
    }
  );
});

// Tests if cart already has an element with that book_id
const hasBook = (req, res, next) => {
  const { book_id } = req.body;
  db.query(
    `SELECT
      *
    FROM cart_items
    WHERE book_id = $1`,
    [book_id],
    (error, results) => {
      if (error) {
        res.send(error.message);
      } else if (results.rows.length) {
        res.json({ message: "This item already exists in your cart!" });
      } else {
        next();
      }
    }
  );
};

// Create a cart_item
cart_items.post("/", hasBook, (req, res, next) => {
  const { book_id, quantity } = req.body;
  console.log(book_id);
  db.query(
    `INSERT INTO cart_items (user_id, book_id, quantity) VALUES ($1, $2, $3)
    RETURNING id, user_id, book_id, quantity`,
    [req.user.id, book_id, quantity],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(201).json({
          message: "Added to cart!",
          id: results.rows[0].id,
          user_id: results.rows[0].user_id,
          book_id: results.rows[0].book_id,
          quantity: results.rows[0].quantity,
        });
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
    AND book_id = $3
    RETURNING id, user_id, book_id, quantity`,
    [quantity, req.user.id, req.params.bookId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.message);
      } else {
        res.status(200).json({
          message: "Cart order updated!",
          id: results.rows[0].id,
          user_id: results.rows[0].user_id,
          book_id: results.rows[0].book_id,
          quantity: results.rows[0].quantity,
        });
      }
    }
  );
});

// Remove cart_item (i.e a cart order)
cart_items.delete("/:bookId", (req, res, next) => {
  db.query(
    `DELETE FROM cart_items
        WHERE user_id = $1
        AND book_id = $2
        RETURNING id, user_id, book_id, quantity`,
    [req.user.id, req.params.bookId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.message);
      } else {
        res.status(204).json({
          message: "The book has been removed from your cart!",
          id: results.rows[0].id,
          user_id: results.rows[0].user_id,
          book_id: results.rows[0].book_id,
          quantity: results.rows[0].quantity,
        });
      }
    }
  );
});

module.exports = cart_items;
