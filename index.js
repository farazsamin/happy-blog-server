const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios')

const cors = require('cors')
// const ObjectID = require('mongodb').ObjectID

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.11ltg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors())
app.use(express.json())

const port = 5000

console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello World! Working')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


client.connect(err => {
  
  const userCollection = client.db("happy-blog").collection("users");

  app.post('/isUser', async (req, res) => {
    // console.log(req.query.email)
    try{
      console.log(req.body.password)
      const user = await userCollection.findOne({ email: req.body.email, password : req.body.password })
      // console.log(user) 
      if(user === null){
        throw new Error("User Not Found")
        
      }
      res.status(200).send({user})
    }
    catch(err){
      console.log(err.message)
      res.status(400).send({err : err.message})
    }
    
  })

  app.get('/blogs', async (req,res)=>{
    try{
        const response = await axios.get('https://novablog.webdevdemo.com/wp-json/wp/v2/posts?per_page=3&_embed')
        res.status(200).send(response.data)
    }catch(err){

    }
  })


  

});


