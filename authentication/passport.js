const passport = require('passport');
const Strategy = require("passport-local").Strategy;
const mongoose = require('mongoose');
const User = require('../database/user');
const dotenv = require('dotenv');
dotenv.config();


const strategy =  new Strategy((username, password, cb) => {
    User.findOne({ username: username }, null, null, (err, user) => {
      // Error
      if (err) {
        return cb(err);
      }
      if (username.length === 0) {
        return cb(null, false, { message: "Invalid username" });
      }
      else if (password.length === 0) {
        return cb(null, false, { message: "Invalid password" });
      }
      else if (user === null) {
        return cb(null, false, { message: "Username does not exist" });
      }
      // Incorrect password
      else if (user.password !== password) {
        return cb(null, false, { message: "Incorrect password" });
      }
      // Login successful
      return cb(null, user);
    });
  });

module.exports = strategy;
