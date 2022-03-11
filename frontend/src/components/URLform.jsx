import React from 'react'
import {useState, useEffect} from 'react'
import validator from 'validator'
import axios from 'axios'

function URLform() {
  //state hooks
  const [url, seturl] = useState('');
  const [links, setlinks] = useState([]);

  // get all URLs already in database 
  //returns null :(
  // need to do it one time i used usEffect
  useEffect(()=>{
  axios.get('http://localhost:5000/API/getData')
    .then(res=>{
      console.log(res.data);
      const userURLs=res.data;
      setlinks(userURLs);
       
     }).catch(reason=>{
        console.error(reason);
  })
},[])


  //event handlers
  const handleChange=(e)=>{
    e.preventDefault();
    seturl(e.target.value);
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    const validURL=validator.isURL(url,{require_protocol : true});
    if(!validURL){
      alert('please enter a valid url with http(s) protocol');
    }else{
      console.log('url is : '+url)
      axios.post('http://localhost:5000/API/shorten',{url:url})
      .then(res=>{
        console.log('status: '+res.data.status);
        console.log('hash code: '+res.data.doc.hash);
        if(res.data.status===200){ // new link    
          setlinks([...links,res.data.doc]);
        }
      })
      .catch(reason=>{
        console.log(reason);
      }) 
    }
  }
  
  return (
    <div className='w-screen flex flex-col justify-evenly container'>
    <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={handleSubmit} >
      <div className='flex justify-center items-center border-b border-teal-500 py-2 w'>
        <label htmlFor="urlInput" className='flex-shrink-0 mr-4 content-center text-gray-700 text-sm font-bold'>URL : </label>
        <input id="urlInput"
         type='text' 
         className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          placeholder='enter a valid URL'
          onChange={handleChange}>
        </input>
        <button type='submit' className='flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded'>shorten</button>
      </div>
    </form>
    <h1 className='text-black-700 text-2xl font-bold'>links you have already :</h1>
    <div name="links list container" className='mt-12 container content-center'>
      {
          links.map(link => {
            return <p key={link._id} >
              <span className='text-black-700 text-xl font-bold mr-5'>URL:</span>{link.URL} 
              <span className='text-black-700 text-xl font-bold mr-5 ml-5'>shortened:</span>{'http://localhost:5000/'+link.hash}</p>
          })
      }
    </div>
    </div>
  )
}

export default URLform