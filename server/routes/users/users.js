const express = require("express");
const users = express.Router();
const bcrypt = require("bcrypt");
const db = require("../../db");
const bodyParser = require("body-parser");
const carts = require("../carts/carts");
const { isLoggedIn, isAdmin } = require("../../db/helper");

users.use(bodyParser.urlencoded({ extended: true }));

users.use("/carts", isLoggedIn, carts);

// Get all users
users.get("/all", isLoggedIn, isAdmin, async (req, res) => {
  db.query("SELECT * FROM users", (error, results) => {
    if (error) {
      res.status(400).send(error.stack);
    } else {
      res.status(200).json(results.rows);
    }
  });
});

// Gets a user's details and only their details
users.get("/", isLoggedIn, (req, res) => {
  db.query(
    `SELECT * FROM users WHERE id = $1`,
    [req.user.id],
    (error, results) => {
      res.status(200).json(results.rows);
    }
  );
});

// Update the username and password of the user's details
users.put("/", isLoggedIn, async (req, res) => {
  const { username, password } = req.body;
  // Encrypt the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  db.query(
    "UPDATE users SET username = $2, password = $3 WHERE id = $1 RETURNING id, username, password, email, isadmin",
    [req.user.id, username, hashedPassword],
    (error) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(200).json({
          id: req.user.id,
          username: username,
          password: password,
          email: results.rows[0].email,
          isadmin: results.rows[0].isadmin,
        });
      }
    }
  );
});

// Register a user
users.post("/register", async (req, res, next) => {
  const { username, password, email } = req.body;
  db.query(
    // Check if user exists already
    "SELECT * FROM users WHERE email = $1",
    [email],
    async (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        res
          .status(404)
          .json({ message: "User with that email already exists!" });
        return next();
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        db.query(
          `INSERT INTO users (username, password, email) VALUES ($1, $2, $3)
          RETURNING id, username, password, email, isadmin`,
          [username, hashedPassword, email],
          (error, results) => {
            if (error) {
              res.status(400).send(error.stack);
            } else {
              console.log(results.rows[0]);
              res.status(201).json({
                message: "Your registration was successful!",
                id: results.rows[0].id,
                username: username,
                password: hashedPassword,
                email: email,
                isadmin: results.rows[0].isadmin,
              });
            }
          }
        );
      }
    }
  );
});

module.exports = users;
