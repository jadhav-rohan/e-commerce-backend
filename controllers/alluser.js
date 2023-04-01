const user = require("../models/user");
const User = require("../models/user");

exports.getUsers = (req, res, next) => {
  User.find().exec((err, user) => {
    if (!user || err) {
      return res.status(400).json({
        err: "NO USERS FOUND!",
      });
    }
  });
  res.json(user);
  next();
};
