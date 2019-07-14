const mongoose = require("mongoose")
const Schema = mongoose.Schema

const GroupSchema = new Schema({
	owner: String, // ObjectId
	name: String,
	barcodes: [], // ObjectIds
})

module.exports = mongoose.model('Group', GroupSchema)

