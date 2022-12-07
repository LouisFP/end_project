// Check whether is admin
async function isAdmin(req, res, next) {
  if (await req.user.isadmin) {
    next();
  } else {
    res.send({ message: "Not authorized!" });
  }
}

// Check whether a user is Logged in
async function isLoggedIn(req, res, next) {
  if (await req.user) {
    next();
  } else {
    res.send({ message: "Please login!" });
  }
}
module.exports = {
  isAdmin,
  isLoggedIn,
};
