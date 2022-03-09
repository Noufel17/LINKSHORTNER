const express = require('express');
// initializing express
const app=express();

// path to test the server 
app.get('/',(req,res)=>{
    res.send('response');
});

//initializing server port 
const port=process.env.PORT || 5000;
app.listen(port, ()=> console.log(`server is running on port : ${port}`));
