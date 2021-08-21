const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    name: String,
    accountNumber: Number,
    senderAccountNumber: Number,
    amount: Number,
    notes: String,
    timeSent: Date
}, { collection: "transactions" })

module.exports = mongoose.model("Transactions", transactionSchema)