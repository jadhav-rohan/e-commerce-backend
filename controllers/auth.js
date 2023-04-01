const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const { urlencoded } = require("body-parser");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        err: "Email not found!",
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        err: "Password do not match!",
      });
    }

    const token = jwt.sign({ _id: user._id }, "rohan");

    res.cookie("token", token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout Succesfully!",
  });
};

exports.isSignedIn = expressJwt({
  secret: "rohan",
  userProperty: "auth",
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.porfile && req.auth && req.porfile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied!",
    });
  }
  next(); //next is responsible for transferring the control form one middleware to another
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not admin, Access Denied!",
    });
  }
  next();
};
