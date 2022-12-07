const express = require("express");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../db");

module.exports = (passport, db) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.query(
      "SELECT id, username, isadmin FROM users WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          return done(error);
        } else {
          return done(null, results.rows[0]);
        }
      }
    );
  });
  passport.use(
    new LocalStrategy(function (username, password, done) {
      db.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
        (error, results) => {
          if (error) {
            return done(error);
          }
          if (results.rows.length > 0) {
            const data = results.rows[0];
            bcrypt.compare(password, data.password, (err, res) => {
              if (res) {
                done(null, {
                  id: data.id,
                  username: data.username,
                  isadmin: data.isadmin,
                });
              } else {
                done(null, false, { message: "Password is incorrect!" });
              }
            });
          } else {
            done(null, false, { message: "No user with that username!" });
          }
        }
      );
    })
  );
};
