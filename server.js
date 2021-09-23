//to run npm run dev and make sure to run redis with the command redis-cli

const express = require('express');
const bodyParser= require('body-parser')
const redis = require('redis');
const MongoClient = require('mongodb').MongoClient

const connectionString = "mongodb+srv://patricia:ammonite@cluster0.i6o2n.mongodb.net/test?retryWrites=true&w=majority"
const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const app = express();

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')

    const db = client.db('test')
    const usersCollection = db.collection('users')
    const redis_client = redis.createClient(REDIS_PORT);
    let lname 

    app.set('view engine', 'ejs')

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    app.listen(PORT, function() {
        console.log('listening on 3000')
    })

    // Cache middleware
    function cache(req, res, next) {
    
      redis_client.get(lname, (err, data) => {
        if (err) throw err;
        if (data !== null) {
          res.render('index.ejs', { users: [JSON.parse(data)] })
        } else {
          next();
        }
      });
    }

    //app.get(endpoint, callback) endpoint is the bit after the domain, callback what to do when endpoint matches the stated
    app.get('/', (req, res) => {
      usersCollection.find().toArray()
            .then(results => {
                res.render('index.ejs', { users: results })
        })
        .catch(error => console.error(error))
    })

    app.post('/searchuser', (req, res) => { 
      lname = req.body.search_lname
      res.redirect('/getuser')
    })

    app.post('/emptycache', (req, res) => { 
      redis_client.flushall('ASYNC', (err, succeedded) => {
        console.log("Cache emptied")
      });
      res.redirect('/')
    })

    app.get('/getuser', cache, (req, res) => {
        if (lname){
          const query = { lname: lname};
          usersCollection.findOne(query)
                .then(results => {
                  //add results to cache
                  redis_client.set(lname, JSON.stringify(results))
                  //shows result to console
                  res.render('index.ejs', { users: [results] })
                    
            })
            .catch(error => console.error(error))}
           else{res.redirect('/')}
        // })
     
    })

    app.post('/adduser', (req, res) => {
        usersCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })

      app.post('/edituser', (req, res) => {
        usersCollection.findOneAndUpdate(
          { lname: req.body.chosen_lname },
          {
            $set: {
              fname: req.body.new_fname,
              lname: req.body.new_lname,
              role: req.body.new_role,
              age: req.body.new_age
            }
          },
          {
            upsert: true
          }
        )
        .then(result => {
          res.redirect('/')
         })
        .catch(error => console.error(error))
    })

      app.post('/deleteuser', (req, res) => {
        usersCollection.deleteOne(
          { lname: req.body.del_lname }
        )
          .then(result => {
            if (result.deletedCount === 0) {
              console.log('No user found with that surname')
            }
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })
      
  })
  .catch(error => console.error(error))