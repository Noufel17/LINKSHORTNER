const express = require('express');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');


// import URL data model 


// initializing express
const app=express();

// bodyParser to get data from data base into the app in json format
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//database key
const db=require('./config/keys').mongoURL;

// create connection to the database
mongoose.connect(db)
    .then(()=> console.log('mongoDB connected sucessfully'))
    .catch((err)=> console.log(err));

// path to test the server 
app.get('/',(req,res)=>{
    res.send('response from server');
});

//initializing server port 
const port=process.env.PORT || 5000;
app.listen(port, ()=> console.log(`server is running on port : ${port}`));
