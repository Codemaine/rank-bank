
const bcrypt = require('bcryptjs');
const accountModel = require('../models/accountModel');
const jwt = require('jsonwebtoken')
const emailjs = require("emailjs-com")

const signUp = (req, res) => {
    const { name, email,  account_number, password } = req.body;
accountModel.findOne({ email: email }).then(userDoc => {
    if (userDoc){
        res.send({ message: "an error occured", error: "an account has been found with same email" })
    }else {
        bcrypt.hash(password, 7).then(hashedPassword => {
            const user = new accountModel({ name, accountNumber: account_number, email, password: hashedPassword })
            user.save().then(user => {
                const token = jwt.sign({
                    name: user.name,
                    accountNumber: user.accountNumber,
                    email: user.email,
                    userId: user._id
                }, "f21cb2048f56107dfb9279a8d47de87c")
                res.send({ message: "user succesfully created", token })
                emailjs.send("service_ag80x0s", "template_d71f9uq", {
                    name: user.name,
                    accountNumber: user.accountNumber,
                    email: user.email
                })
                
        }).catch((err) => console.log(err))
        }).catch(err => res.send({ message: "an error occured", error: err }))
    }
})  
}

const signIn = (req, res) => {
    const { email, password } = req.body;
    accountModel.findOne({ email: email }).then(userDoc => {
        if (userDoc){
            bcrypt.compare(password, userDoc.password)
            .then(() => {
                const token = jwt.sign({
                    name: userDoc.name,
                    accountNumber: userDoc.accountNumber,
                    email: userDoc.email,
                    userId: userDoc._id
                }, "f21cb2048f56107dfb9279a8d47de87c")
                // the key is an md5 hash
                res.send({ message: "user signed in", token })
            }).catch((err) => res.send({ message: "an error occured", error: err }))
        }else {
            res.send({ message: "an error occured", error: "user not found" })
        }
    })
}

const vertifyToken = (req, res) => {
    const { accountToken } = req.body;
    const data = jwt.verify(accountToken, "f21cb2048f56107dfb9279a8d47de87c");
    if (data){
     res.send({ message: "sign in", isLegit: true, data })
    }else {
        res.send({ message: "not signed in", isLegit: false, data: undefined })
    }
}

module.exports = {
    signUp,
    signIn,
    vertifyToken
}