const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../db");

module.exports = (passport, db) => {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      db.query(
        "SELECT * FROM WHERE username = $1",
        [username],
        async (error, results) => {
          console.log(results);
          if (err) {
            return done(err);
          }
          if (results.rows.length > 0) {
            const data = results.rows[0];
            bcrypt.compare(password, data.password, (err, res) => {
              if (res) {
                done(null, {
                  id: data.id,
                  username: data.username,
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

  passport.serializeUser((user, done) => {
    console.log("Serialising user");
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.query(
      "SELECT id, username FROM users WHERE id = $1",
      [parseInt(id, 10)],
      (error, results) => {
        if (error) {
          return done(error);
        } else {
          return done(null, results.rows[0]);
        }
      }
    );
  });
};
