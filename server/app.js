const express = require("express");
const db = require("./db/index.js");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const logger = require("morgan");
const cors = require("cors");
const flash = require("connect-flash");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

// Cross-site request forgery protection
const { csrfSync } = require("csrf-sync");
const { generateToken, csrfSynchronisedProtection } = csrfSync();

const { v4: uuidv4 } = require("uuid");
const SERVER_PORT = process.env.SERVER_PORT;

// Express routing imports
const { isLoggedIn } = require("./db/helper.js");
const books = require("./routes/books/books");
const users = require("./routes/users/users");
const orders = require("./routes/orders/orders");

const app = express();

// Cross-origins-resource-security
const origin = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(origin));

// Live Reload material
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Middleware for logging and parsing and others
app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "/client/public")));

app.use(connectLiveReload());

// Session middlware
app.use(
  session({
    genid: function () {
      return uuidv4();
    },
    secret: uuidv4(),
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
      secure: true,
      sameSite: "none",
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  })
);

// CSRF middleware THIS NEEDS FURTHER WORK
// const myRoute = (req, res) => res.json({ token: generateToken(req) });
// const csrftProtectionMiddleware = () => {
//   const ignoreMethods = ["GET", "HEAD", "OPTIONS"];
//   return (req, res, next) => {
//     if (ignoreMethods.indexOf(req.method) >= 0) {
//       next();
//     } else {
//       csrfSynchronisedProtection(req, res, next);
//     }
//   };
// };
// app.use(csrftProtectionMiddleware());

// Rate limiting
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});

// ADD THIS BACK IN
// app.use(limiter);

// CORS again
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": [
          "'self'",
          "http://localhost:35729/livereload.js",
          "https://gc.kis.v2.scr.kaspersky-labs.com/FD126C42-EBFA-4E12-B309-BB3FDD723AC1/main.js",
        ],
      },
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Express routing

// Allowing for withCredentials: true
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/////////////////////////////////////////////
// Add isLoggedIn back to books and orders //
/////////////////////////////////////////////
require("./routes/passport")(passport, db);
app.use("/api/books", books);
app.use("/api/users", users);
app.use("/api/orders", orders.orders);

// Log in User
app.post(
  "/api/users/login",
  passport.authenticate("local", {
    failureRedirect: "/api/users/login/failure",
    failureFlash: true,
  }),
  (req, res) => {
    req.logIn(req.user, (err) => {
      if (err) {
        res.json({ error: err });
      }
      console.log(req.session.id);
      res.status(200).json(req.user);
    });
  }
);

app.get("/api/users/login/failure", (req, res) => {
  console.log(req.session);
  let flashLength = req.session.flash.error.length;
  let latestError = req.session.flash.error[flashLength - 1];
  res.status(401).json({ latestError });
});

// Log out User
app.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    return next(err);
  });
  res.status(200).json({ message: "User is logged out!" });
});

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: path.join(__dirname, "../client/public"),
  });
  res.json({ message: "Hello World!" });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
