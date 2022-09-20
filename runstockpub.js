var express = require('express');
var app = express();
const redis = require("redis")
require('dotenv').config()

const publisher = redis.createClient({url: process.env.REDIS_SERVER_PUBSUB})

publisher.on("connect", () => {console.log("connected")})
publisher.on("error", (error) => {console.log("error in red",error)})

app.post('/publish', async function (req, res) {
    try{
      publisher.publish(req.body.channel, JSON.stringify(req.body.message))
      res.send(true)  
    }catch(error){
      console.log("Error in publishing to redis - do something",req,error)
      res.send(false)
    }
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  publisher.connect()
  console.log(`app running on port ${PORT}`)
});
