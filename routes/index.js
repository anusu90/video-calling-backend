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

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
  res.status(200).json({ message: "errpr" })
});

router.get("/check", (req, res) => {
  res.status(200).json({ message: "user is here" })
})

module.exports = router;
