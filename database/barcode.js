const mongoose = require('mongoose')
const Schema = mongoose.Schemaa

const BarcodeSchema = new Schema({
	group: String, // ObjectId
	name: String,
	url: String,
	data: {}
})

module.exports = mongoose.model('Barcode', BarcodeSchema)
