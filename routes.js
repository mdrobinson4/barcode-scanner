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
const Barcode = require("./database/barcode")

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

const upload = require("./database/aws")();

// create a new group
app.post("/create-group", (req, res) => {
  let user = User.findOne(
    {'email': req.body.email, 'password': req.body.password},
    (err, user) => {
      if (!err && user) {
        // create group
        const group = new Group({
          owner: user._id,
          name: req.body.name,
          barcodes: []
        });
        // save the group
        group.save((err, group) => {
          if (!err && group) {
            // add group to user
            user.groups.push(group._id);
            user.save();
            res.send({success: true, group});
          }
        })
      }
    }
  );
  // error 
  res.send({success: false, err});
});

// upload a new barcode
app.post("/upload-barcode", (req, res) => {
  // get the user
  let user = User.findOne(
    {'email': req.body.email, 'password': req.body.password},
    (err, user) => {
      if (!err && user) {
        // create new barcode
        const barcode = new Barcode({
          group: req.body.group,
          name: req.body.name,
          url: req.body.url
        });
        // save barcode
        barcode.save((err, barcode) => {
          if (!err && barcode) {
            user.groups.push(barcode._id);
            user.save();
            res.send({success: true, barcode});
          }
        });
      }
    }
  );
});

// get all of the group names
// sent user
app.get("/groups", (req, res) => {
  const groups = req.user.groups;
  // find all of the groups
  Group.find( 
    { $elemMatch: { $in: groups } },
    (err, groups) => {
      if (!err && groups.length) {
        console.log(groups);
        req.send({success: true, groups});
      }
  });
});

// get a specific group
// sent group id
app.get("/group", (req, res) => {
  Group.findOne(
    { _id: req.body.id },
    (err, group) => {
      if (!err && group) {
        res.send({success: true, group});
      }
    }
  )
});

// gets a specific barcode
// sent barcode id
app.get("/barcode", (req, res) => {
  Barcode.find(
    { _id: req.body.id },
    (err, barcode) => {
      if (!err && barcode) {
        res.send({success: true, barcode});
      }
    }
  )
})

module.exports = app;
