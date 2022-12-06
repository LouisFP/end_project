const express = require("express");
const db = require("./db/index.js");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const logger = require("morgan");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT || 3000;

// Express routing imports
const books = require("./routes/products/books");
const users = require("./routes/users/users");
const orders = require("./routes/orders/orders");

const app = express();

// Live Reload material
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(connectLiveReload());

app.set("trust proxy", 1);
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());

app.use(
  session({
    secret: uuidv4(),
    cookie: { maxAge: 60 * 60 * 24 * 1000, secure: false, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
  })
);

// Express routing
require("./routes/passport")(passport, db);
app.use("/books", books);
app.use("/users", users);
app.use("/orders", orders.orders);

app.use(passport.initialize());
app.use(passport.session());

// Log in User
app.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Logging in");
  req.logIn(req.user, (err) => {
    if (err) {
      return next(err);
    }
    res.send(req.user);
  });
});

// Log out User
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    return next(err);
  });
  res.send("User is logged out!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
