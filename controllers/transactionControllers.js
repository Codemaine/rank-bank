const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const transactionModel = require('../models/transactionModel')
const accountModel = require('../models/accountModel')

const sendMoney = (req, res) => {
    const { name, accountNumber, senderAccountNumber, amount, notes, timeSent } = req.body;
    const transaction = new transactionModel({ name, accountNumber, senderAccountNumber, amount, notes, timeSent })
    accountModel.findOne({ accountNumber: senderAccountNumber }).then(Doc => {
        if(Doc){
            transaction.save().then(data => {
                res.send({ message: "money sent successfully", data })
            }).catch(err => res.send({ message: "an error occured", error: err }))
        }else {
            res.send({ message: "an error occured", error: "sender account not found" })
        }
    })
}

const viewTransactions = (req, res) => {
    const accountToken = req.get('Authorization').split(" ")[1];
    const data = jwt.verify(accountToken, "f21cb2048f56107dfb9279a8d47de87c");

    if(!data) {
        res.send({ message: "an error occured", error: "the token is invalid" })
    }else {
        transactionModel.find({ senderAccountNumber: data.accountNumber }).then(docData => {
            if(!docData.length == 0){
                res.send({ message: "data found", data: docData })
            }else {
                res.send({ message: "no data found" })
            }
        })
    }
}

module.exports = {
    sendMoney,
    viewTransactions
}