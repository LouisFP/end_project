const express = require("express");
const users = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const db = require("../../db");
const bodyParser = require("body-parser");
const carts = require("../carts/carts");
////////////////////////////////////////////////////////
// Need to ensure authentication                      //
// ie for get all users must be an admin              //
// for get users by userId must be that specific user //
// and so on                                          //
////////////////////////////////////////////////////////

users.use(bodyParser.urlencoded({ extended: true }));

// Gets userId params
users.param("userId", (req, res, next, id) => {
  const idToFind = Number(id);
  db.query(
    "SELECT * FROM users WHERE id = $1",
    [idToFind],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length === 0) {
        res.status(404).send("User not found");
      } else {
        req.bookIndex = results.rows[0].id;
        next();
      }
    }
  );
});

users.use("/:userId/carts", carts);

// Get all users (add in only if admin)
users.get("/", (req, res, next) => {
  db.query("SELECT * FROM users", (error, results) => {
    if (error) {
      res.status(400).send(error.stack);
    } else {
      res.status(200).json(results.rows);
    }
  });
});

// Gets a user by their userId
users.get("/:userId", (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE id = $1`,
    [req.bookIndex],
    (error, results) => {
      res.status(200).json(results.rows);
    }
  );
});

// Update the username and password
users.put("/:userId", (req, res, next) => {
  const { username, password } = req.body;

  db.query(
    "UPDATE users SET username = $2, password = $3 WHERE id = $1",
    [req.bookIndex, username, password],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res
          .status(200)
          .send(
            `User with id ${req.bookIndex}: username and password updated!`
          );
      }
    }
  );
});

users.get("/login", (req, res, next) => {
  res.send("Hello");
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
        res.status(400).send("User with that email already exists!");
        return next();
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword.length);
        db.query(
          "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
          [username, hashedPassword, email],
          (error, results) => {
            if (error) {
              res.status(400).send(error.stack);
            } else {
              res
                .status(201)
                .json({ message: "Your registration was successful!" });
            }
          }
        );
      }
    }
  );
});

// Log in User
users.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/:userId",
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.send(user);
    console.log("Logging in");
  }
);

// Log out User
users.get("/logout", (req, res) => {
  req.logout((err) => {
    return next(err);
  });
  res.redirect("/login");
});

// users.get("/register", (req, res) => {
//   res.render("/register");
// });

// users.get("/login", (req, res) => {
//   res.render("/login");
// });

module.exports = users;
