//to run npm run dev and make sure to run redis with the command redis-cli

const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const MongoClient = require("mongodb").MongoClient;
const BSON = require("bson");
var cors = require("cors");

const connectionString =
  "mongodb+srv://melanie:Meladyfresh1@cluster0.v4ets.mongodb.net/Deployment-test?retryWrites=true&w=majority";
const PORT = process.env.PORT || 8080;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const app = express();
app.use(cors());

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");

    const db = client.db("test");
    const usersCollection = db.collection("users");
    const redis_client = redis.createClient(REDIS_PORT);
    let lname;

    // app.set("view engine", "ejs");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));

    app.listen(PORT, function () {
      console.log("listening on 8080");
    });

    // Cache middleware
    function cache(req, res, next) {
      redis_client.get(lname, (err, data) => {
        if (err) throw err;
        if (data !== null) {
          console.log("OK");
          // res.render("index.ejs", { users: [JSON.parse(data)] });
        } else {
          next();
        }
      });
    }

    //app.get(endpoint, callback) endpoint is the bit after the domain, callback what to do when endpoint matches the stated
    app.get("/", (req, res) => {
      usersCollection
        .find()
        .toArray()
        .then((results) => {
          res.json(results);
        })
        .catch((error) => console.error(error));
    });

    app.post("/searchuser", (req, res) => {
      lname = req.body.search_lname;
      // res.redirect("/getuser");
    });

    app.post("/emptycache", (req, res) => {
      redis_client.flushall("ASYNC", (err, succeedded) => {
        console.log("Cache emptied");
      });
      res.redirect("/");
    });

    app.post("/getuser", (req, res) => {
      console.log("GET USER REQUEST", req.body);
      if (true) {
        const query = req.body.uid;

        usersCollection
          .findOne({ _id: BSON.ObjectId(query) })
          .then((results) => {
            console.log("RESULTS", results);
            //add results to cache
            redis_client.set(results.user.lname, JSON.stringify(results));
            // //shows result to console
            res.json(results);
          })
          .catch((error) => console.error(error));
      } else {
        res.redirect("/");
      }
      // })
      res.status(200);
    });

    app.post("/adduser", (req, res) => {
      console.log("REQ", req);
      usersCollection
        .insertOne(req.body)
        .then((result) => {
          console.log("INSERTED USER RECORD");
        })
        .catch((error) => console.error(error));
    });

    app.post("/edituser", (req, res) => {
      usersCollection
        .findOneAndUpdate(
          { _id: BSON.ObjectId(query) },
          {
            $set: {
              fname: req.body.user.fname,
              lname: req.body.user.lname,
              role: req.body.user.role,
              age: req.body.user.age,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.post("/deleteuser", (req, res) => {
      usersCollection
        .deleteOne({ lname: req.body.del_lname })
        .then((result) => {
          if (result.deletedCount === 0) {
            console.log("No user found with that surname");
          }
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));
