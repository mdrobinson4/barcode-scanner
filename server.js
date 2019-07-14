const AWS = require("aws-sdk");
const fs = require("fs");
const fileType = require("file-type");
const bluebird = require("bluebird");
const multiparty = require("multiparty");
require("dotenv").config();
//
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const cors = require('cors');

const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');

mongoose.set("useFindAndModify", false);
const cookieSession = require("cookie-session");

const User = require("./database/user");
const barcode = require("./database/barcode");

/*  Connect to mongodb database using mongoose  */
mongoose.connect(process.env.mongodbUrl, { useNewUrlParser: true });
let db = mongoose.connection;
db.on("error", err => {
  console.log(err);
});

/*  Authorization for logging into mobi chat room  */

const port = process.env.PORT || 5000;
if (process.env.PORT !== 5000) {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "client/build")));
}


// Serve static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    keys: ['imgoingtokeepgoing']
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes'));

// Configure passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
passport.use(require("./authentication/passport"));



// Client has connected
io.on("connection", socket => {


});

server.listen(port);
                                                                                                                             
