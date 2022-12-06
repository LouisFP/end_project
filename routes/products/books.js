const express = require("express");
const books = express.Router();
const db = require("../../db");
const bodyParser = require("body-parser");

// Get bookId and test if bookId exists in database
books.param("bookId", (req, res, next, id) => {
  const idToFind = Number(id);
  db.query(
    "SELECT * FROM books WHERE id = $1",
    [idToFind],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length === 0) {
        res.status(404).send("Book not found");
      } else {
        req.bookIndex = results.rows[0].id;
        next();
      }
    }
  );
});

// Allows use of req.body by parsing into JSON
books.use(bodyParser.json());

// Gets all books
books.get("/", (req, res, next) => {
  db.query("SELECT * FROM books ORDER BY id ASC", (error, results) => {
    console.log(req.session);
    console.log(req.session.passport.user);
    if (error) {
      res.status(400).send(error.stack);
    } else {
      res.status(200).json(results.rows);
    }
  });
});

// Gets books by bookId
books.get("/:bookId", (req, res, next) => {
  db.query(
    "SELECT * FROM books WHERE id = $1",
    [req.bookIndex],
    (error, results) => {
      res.status(200).json(results.rows);
    }
  );
});

// Creates a new book
books.post("/", (req, res, next) => {
  const { title, author, num_of_pages, genre, price } = req.body;

  db.query(
    "INSERT INTO books (title, author, num_of_pages, genre, price) VALUES ($1, $2, $3, $4, $5)",
    [title, author, num_of_pages, genre, price],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(201).send(`Book added!`);
      }
    }
  );
});

// Updates the price of a book
books.put("/:bookId", (req, res, next) => {
  const { price } = req.body;
  db.query(
    "UPDATE books SET price = $1 WHERE id = $2",
    [price, req.bookIndex],
    (error, results) => {
      res.status(200).send(`Book with id ${req.bookIndex}: price updated!`);
    }
  );
});

// Deletes a book by its bookId
books.delete("/:bookId", (req, res, next) => {
  db.query(
    "DELETE FROM books WHERE id = $1",
    [req.bookIndex],
    (error, results) => {
      res.status(204).send(`Book deleted!`);
    }
  );
});

module.exports = books;
