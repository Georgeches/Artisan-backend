const  mongoose = require("mongoose")

const oderSchema = new mongoose.Schema({
    oder_number: String,
    customer_id: {type: String, ref: 'Customer'},
    items: [String],
    status: String,
    payment_status: Boolean,
    shipping_fee: String,
    amount: String
},{timestamps:true})

const Oders = mongoose.Model('Oders',oderSchema)

module.exports = Oders