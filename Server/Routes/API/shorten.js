const express=require('express');
const router=express.Router();
const uniqid=require('uniqid');

// import URLs model (as the data from the database)
const URL=require('../../models/URLs');

//Router
// GET REQUEST route to API/shorten/test testing
router.get('/test',(req,res)=> res.json({msg:'in API'}));

// POST REQUEST  route to API/shorten/
router.post('/',(req,res)=> {
    // to conferm that we got the request we print it on the console
    console.log(req.body);
    if(req.body.url){
        urlData=req.body.url;
        console.log(urlData);
    }
    // check if the url sent in the request (simulates the URLs submitted in front end) exists in the database
    // we have to filter also by urlOwner
    URL.findOne({URL : urlData},(err,doc)=>{ 
        if(doc){ // if url already exists in data base we dont all another one
            console.log('URL already exists in DB')
            res.send({
                url: doc.URL,
                    hash: doc._id,
                    status: 200,
                    statusTxt: 'ok'
            })
        }else{ // we add it to the data base(largly thinking i need to add an attribute urlOwner  so we can add it if they belong to diffrent owners)
            console.log('this is a new URL');
            const link = new URL({
                _id:uniqid(),
                URL:urlData,

            });
            link.save((err)=>{
                if(err){
                    return console.error(err);
                }
                res.send({
                    url: urlData,
                    hash: link._id,
                    status: 200,
                    statusTxt: 'ok'
                })
            });
        }
    });
});

// export router
module.exports=router;