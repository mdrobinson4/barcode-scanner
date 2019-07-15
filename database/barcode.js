const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BarcodeSchema = new Schema({
	//group: String, // ObjectId
	name: String,
	url: String,
	data: {}
})

module.exports = mongoose.model('Barcode', BarcodeSchema)
