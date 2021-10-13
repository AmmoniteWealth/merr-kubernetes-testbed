const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const BSON = require("bson");
var cors = require("cors");

const connectionString =
  "mongodb+srv://melanie:Meladyfresh1@cluster0.v4ets.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = 5000;

const app = express();
app.use(cors());

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");

    const db = client.db("test");
    const usersCollection = db.collection("users");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));

    app.listen(PORT, function () {
      console.log("listening on 5000");
    });

    //app.get(endpoint, callback) endpoint is the bit after the domain, callback what to do when endpoint matches the stated
    app.get("/", (req, res) => {
      console.log("PROCESSING GET USERS REQUEST");
      usersCollection
        .find()
        .toArray()
        .then((results) => {
          res.json(results);
        })
        .catch((error) => console.error(error));
      res.status(200);
    });

    app.post("/adduser", (req, res) => {
      console.log("REQ", req);
      usersCollection
        .insertOne(req.body)
        .then((result) => {
          console.log("INSERTED USER RECORD");
          res.status(200);
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));
