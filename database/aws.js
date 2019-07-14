const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const AWS = require("aws-sdk");
const fs = require("fs");
const fileType = require("file-type");
const bluebird = require("bluebird");
const multiparty = require("multiparty");
require("dotenv").config();

const User = require("../database/user");
const Song = require("../database/song");

// S3 setup
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

AWS.config.setPromisesDependency(bluebird);

const s3 = new AWS.S3();

module.exports = (app, db) => {
  let module = {};
  module.saveToS3 = (filename, buffer, type, cb) => {
    const params = {
      ACL: "public-read",
      Body: buffer,
      Bucket: process.env.S3_Bucket_Name,
      ContentType: type,
      Key: filename
    };
    s3.upload(params, (err, data) => {
      console.log(`Data: ${data}`);
      cb(data);
    }).on("httpUploadProgress", e => {
      console.log(`Uploaded :: ${parseInt((e.loaded * 100) / e.total)}%`);
    });
  };
  return module;
};
