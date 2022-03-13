import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Signup() {
    // define route to sign in page after sign up
    const navigate=useNavigate();
    //define states
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const getUsername=((event)=>{
        event.preventDefault();
        setusername(event.target.value);
    })
    const getPassword=((event)=>{
        event.preventDefault();
        setpassword(event.target.value);
    })
    const submitUser=(event)=>{
        event.preventDefault();
        axios.post('http://localhost:5000/API/signup',{username:username,password:password})
            .then(res=>{
                console.log(res.data);
                if(res.data.account && res.data.status===200 && res.data.statustxt==='saved'){
                    console.log('user saved');
                    // redirect user to sign in or homepage
                    navigate("/Signin");
                }else if(res.data.status===300 && res.data.statustxt==='invalid'){
                    console.log('invalid username or password');
                    // add a div or an alert to display invalid username or password
                    alert('invalid username or password');
                }
            })
            .catch(err=>{
                console.error(err);
            })
    }
  return (
<div className="flex h-screen justify-center content-center">
    <div className="flex flex-wrap justify-center flex-col max-w-full w-1/4">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submitUser}>
            <h1 className='text-black-700 text-xl font-bold mr-5 text-center'>sign up</h1>
            <div className="mb-4">
                <label htmlFor="username"  className="block text-gray-700 text-sm font-bold mb-2">
                    username
                </label>
                <input type="text" placeholder='username' className="shadow appearance-none border rounded w-full py-3 px-3
                 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={getUsername} />
            </div>
            <div className="mb-10">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    password
                </label>
                <input type="password" placeholder='password' className="shadow appearance-none border rounded w-full py-3 px-3
                text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={getPassword}/>
            </div>
            <div className="flex justify-between mb-5">
                <button type='submit' className=" py-2 px-3 rounded bg-teal-500 hover:bg-teal-700
                 border-teal-500 hover:border-teal-700 text-sm border-4 text-white">
                    sign up
                </button>
                <p>have an account? <Link to={"/Signin"}
                className="hover:text-teal-500 hover:underline">sign in</Link> </p>
            </div>
        </form>
    </div>
</div>
    
  )
}

export default Signup