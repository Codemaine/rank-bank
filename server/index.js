const cors = require('cors')
const http = require("http")
const express = require('express')
const { signUp, signIn, vertifyToken } = require("./controllers/accountControllers")
const isAuth = require('./middleware/isAuth')
const { sendMoney, viewTransactions } = require('./controllers/transactionControllers')
const bodyParser = require("body-parser")
const app = express();
const mongoose = require('mongoose')

//Mongoose Uri
const uri = "mongodb+srv://Jermaine:Gpm4QNPJN3i47c1F@cluster0.iwfxy.mongodb.net/codetrain?retryWrites=true&w=majority"

// Cors
app.use(cors({origin: true, credentials: true}))

//Body parser
app.use(bodyParser.json())

//Account Routes
app.post("/signup", signUp)
app.post("/login", signIn)
app.use('/vertify-token', vertifyToken)

//Transaction Routes
app.post('/send-money', isAuth, sendMoney)
app.get('/view-transactions', isAuth, viewTransactions)


mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }).then((res) => {
    app.listen(4000, () => console.log("Server has started"))
}).catch((err) => console.log(err))