var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
const path = require('path');
var mongodb = require('mongodb');
const bcrypt = require('bcrypt');
// const nodemailer = require("nodemailer");
require('dotenv').config(path.join(__dirname, "../.env"))
const MongoClient = require('mongodb').MongoClient
const uri = `mongodb+srv://dBanusu90:${process.env.DB_PASS}@Cluster0.xudfg.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const jwt = require('jsonwebtoken');
var cookie = require('cookie');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post("/register", async (req, res) => {

  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let userDBCollection = client.db('video-calling-db').collection("users");
    let user = await userDBCollection.findOne({
      email: req.body.email
    });

    if (user) {
      res.status(500).json({ message: "User email already exists. Please try forgot password" })
    } else {

      let salt = await bcrypt.genSalt(10);
      let hashedPass = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPass;
      let input = await userDBCollection.insertOne(req.body);

      await client.close();

      if (input.insertedCount === 1) {
        console.log("user inserted")
        res.status(200).json({
          "message": "user inserted"
        })
      } else {
        res.status(500).json({ message: "User registration failed. Please try again" })
      }
    }

  } catch (error) {

  }

})



// LOGIN BACKEND

router.post("/login", async (req, res) => {

  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let userDBCollection = client.db('video-calling-db').collection("users");
    let user = await userDBCollection.findOne({
      email: req.body.email
    });

    if (user) {

      let compare = await bcrypt.compare(req.body.password, user.password);
      if (compare == true) {

        let token = jwt.sign({ user: user }, process.env.RANDOM_KEY_FOR_JWT, { expiresIn: 120 })
        res.setHeader('Set-Cookie', cookie.serialize('myAgainJwt2', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 1 week,
          sameSite: "none",
          secure: true
        }));

        res.status(200).json(user)

      } else {
        res.status(500).json({ message: "Invalid Credentials. Please try again" })
      }

    } else {
      res.status(500).json({ message: "No user found" })
    }

    await client.close();

  } catch (error) {

    res.status(500).json({ message: error })

  }

})

function myAuth(req, res, next) {
  if (req.headers.cookie) {
    console.log("cookie found")
  } else {
    console.log("cookie not found")
  }

  next();
}


router.get("/check", myAuth, (req, res) => {
  res.status(200).json({ message: "user is here" })
})

module.exports = router;
