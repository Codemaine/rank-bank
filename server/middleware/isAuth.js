const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader){
      res.send({ message: "an error occured", error: "Unauthorized" })
    }
    else{
     const token = authHeader.split(" ")[1];
     
     //vertify token
     const decodedToken = jwt.verify(token, "f21cb2048f56107dfb9279a8d47de87c")
     if(!decodedToken){
         res.send({ message: "an error occured", error: "Unauthorized" })
     }else {
         next();
     }
    }

}

module.exports = isAuth