var express = require('express');
var app = express();
const redis = require("redis")
require('dotenv').config()
const bodyParser = require("body-parser");

app.disable('x-powered-by');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const publisher = redis.createClient({url: process.env.REDIS_SERVER_PUBSUB})

publisher.on("connect", () => {console.log("connected")})
publisher.on("error", (error) => {console.log("error in red",error)})

app.post('/publish', async function (req, res) {
    //console.log("about to publish",req.body.channel,JSON.stringify({"data":req.body.message}))
    try{
      publisher.publish(req.body.channel, JSON.stringify(req.body.message))
      res.send(true)  
    }catch(error){
      console.log("Error in publishing to redis - do something",error)
      res.send(false)
    }
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  publisher.connect()
  console.log(`app running on port ${PORT}`)
});
