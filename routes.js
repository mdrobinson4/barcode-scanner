const app = require("express")();
const fs = require("fs");
const fileType = require("file-type");
const bluebird = require("bluebird");
const multiparty = require("multiparty");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
ObjectID = require("mongodb").ObjectID;
const passport = require("passport");

const User = require("./database/user");
const Group = require("./database/group");
const Barcode = require("./database/barcode");

/*  Create Account */
app.post("/create-account", (req, res) => {
  const account = req.body;
  // Checks to see if the username is unique
  User.findOne({ username: account.username }, (err, user) => {
    if (account.username.length === 0)
      res.send({ success: false, message: "Invalid username" });
    else if (account.password.length === 0)
      res.send({ success: false, message: "Invalid password" });
    else if (account.email.length === 0)
      res.send({ success: false, message: "Invalid email" });
    // Unique username
    else if (err || !user) {
      const user = new User({
        username: account.username,
        email: account.email,
        password: account.password
      });
      user.save();
      res.send({ success: true, user }).status(200);
    } else {
      res.send({ success: false, message: "Username taken" }).status(200);
    }
  });
});

/* Logs the user in */
app.post("/login", passport.authenticate("local"), (req, res) => {
  let user = Object.assign({}, req.user);
  delete user.password;
  res.send({
    success: true,
    user: req.user
  });
});

// upload a barcode
app.post("/upload-barcode", (req, res) => {
  let user = User.findOne(
    { email: req.body.email, password: req.body.password },
    (err, user) => {
      if (!err && user) {
        const barcode = new Barcode({
          data: req.body
        });
        barcode.save((err, barcode) => {
          if (!err && barcode) {
            user.barcodes.push(barcode._id);
          }
          res.status(200).send({ barcode, user });
        });
      }
    }
  );
  res.status(404).send({ err });
});

// gets all of the user's barcodes
app.get("/barcodes", (req, res) => {
  // get all of their barcodes
  Barcode.find({ _id: { $in: req.user.barcodes } }, (err, barcodes) => {
    if (!err && barcodes.length) res.status(200).send({ barcodes });
  });
  res.send(404).send({ error });
});

// gets a specific barcode
// sent barcode id
app.get("/barcode", (req, res) => {
  // find the barcode
  Barcode.find({ _id: req.body.id }, (err, barcode) => {
    if (!err && barcode.length) {
      res.status(200).send({ success: true, barcode });
    }
  });
  res.status(404).send({ success: false });
});

module.exports = app;

/////////////////////////////////////////////////

// const upload = require("./database/aws ")();
