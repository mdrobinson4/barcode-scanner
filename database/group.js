const mongoose = require("mongoose")
const Schema = mongoose.Schema

const GroupSchema = new Schema({
	owner: String, // ObjectId
	name: String,
	barcodes: [], // ObjectIds
	description: String
})

module.exports = mongoose.model('Group', GroupSchema)

