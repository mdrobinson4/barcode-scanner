const mongoose = require('mongoose');
const Schema = mongoose.Schema;

UserSchema = new Schema({
  email: String,
  username: String,
  password: String,
  barcodes: [],
  //groups: []
});

module.exports = mongoose.model('User', UserSchema);
