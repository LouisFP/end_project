const express = require("express");
const db = require("./db/index.js");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const logger = require("morgan");

const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT || 3000;

// Express routing imports
const books = require("./routes/products/books");
const users = require("./routes/users/users");

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

app.use(bodyParser.json());
app.use(logger("dev"));

// Express routing
require("./routes/passport")(passport, db);
app.use("/books", books);
app.use("/users", users);

app.use(
  session({
    secret: uuidv4(),
    cookie: { maxAge: 60 * 60 * 24, secure: true, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
