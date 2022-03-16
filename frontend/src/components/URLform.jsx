import React from "react";
import { useState, useEffect } from "react";
import validator from "validator";
import axios from "axios";
import {useNavigate, useParams } from "react-router-dom";

function URLform() {
  //state hooks
  const navigate=useNavigate();
  const [url, seturl] = useState("");
  const [links, setlinks] = useState([]);
  const { username } = useParams();
  // get all URLs already in database
  // need to do it one time i used usEffect
  useEffect(() => {
    axios
      .get("http://localhost:5000/API/getData/" + username) // we have to send username here to filter by it
      .then((res) => {
        console.log(res.data);
        const userURLs = res.data;
        setlinks(userURLs);
      })
      .catch((reason) => {
        console.error(reason);
      });
  }, [username]);

  // still need to emplement a button to delete every link in shown list
  // and a function handle delete
  // add a signed as username in homepage header top right to see which user is signed in
  //event handlers
  const handleChange = (e) => {
    e.preventDefault();
    seturl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validURL = validator.isURL(url, { require_protocol: true });
    if (!validURL) {
      alert("please enter a valid url with http(s) protocol");
    } else {
      console.log("url is : " + url);
      axios
        .post("http://localhost:5000/API/shorten", {
          url: url,
          username: username,
        }) // we have to post username too here
        .then((res) => {
          console.log("status: " + res.data.status);
          console.log("hash code: " + res.data.doc.hash);
          if (res.data.status === 200) {
            // new link
            setlinks([...links, res.data.doc]);
          }
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  };
  const handleDelete=((e,link)=>{
    e.preventDefault();
    axios.post('http://localhost:5000/API/deletion', // delete request is not allowed
    {URL:link.URL,hash:link.hash,username:link.urlOwner})
    .then(res=>{
      console.log(res.data);
      if(res.data.doc && res.data.status===200 && res.data.statustxt==='deleted'){
        // remove link from links state
        setlinks(links.filter((item)=>{
          return item.hash !== link.hash
        }))
      }else if(res.data.status===300 && res.data.statustxt==='not found'){
        console.log('element to delete not found in database');
      }
    })
    .catch(err=>{
      console.error(err);
    })
  })
  const signout=((e)=>{
    e.preventDefault();
    navigate("/Signin");
  })

  return (
    <div className="grid grid-cols-1 grid-row-3 
      grid-flow-row gap-4 h-screen justify-center content-center px-32">
        <header className="w-full flex justify-between items-center ">
          <img src="/img/logo.png"  className="w-256 h-32" alt="logo" />
          <div>
          <p className="text-left py-4 inline-block mr-6
            text-black-500 text-xl font-bold">signed in as <span className="text-left  py-4
            text-black-700 text-xl font-bold"> {username}</span></p>
          <button className="flex-shrink-0 bg-white hover:bg-gray-700 inline-block
                 border-gray-900 border-2 text-gray-900 hover:border-gray-600 text-sm
                  hover:text-white py-1 px-2 rounded" onClick={signout}>
                    signout

          </button>
          </div>
          
        </header>
      
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-1/2 mx-auto "
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center border-b border-teal-500 py-2 ">
            <label
              htmlFor="urlInput"
              className="flex-shrink-0 mr-4 content-center text-gray-700 text-sm font-bold"
            >
              URL :{" "}
            </label>
            <input
              id="urlInput"
              type="text"
              autoFocus
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3
               py-1 px-2 leading-tight focus:outline-none"
              placeholder="enter a valid URL with the protocol included"
              onChange={handleChange}
            ></input>
            <button
              type="submit"
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            >
              shorten
            </button>
          </div>
        </form>
        <table
          className="shadow-lg bg-white border-separate table-fixed w-full mx-auto"
        >
          <thead>
            <tr>
            <th className="bg-blue-100 border text-left px-8 py-4
            text-black-700 text-xl font-bold mr-2 mb-3">URL</th>
            <th className="bg-blue-100 border text-left px-8 py-4
            text-black-700 text-xl font-bold mr-2 mb-3">Shortened</th>
            <th className="bg-blue-100 ">Delete</th>
            </tr>
          </thead>
          {links.map((link) => {
            return (
              <tbody key={link._id}>
                <tr>
                <td className="border px-8 py-4">
                  <p className="break-words mx-auto">{link.URL}</p>
                </td>
                <td className="border px-8 py-4">
                  <a className="hover:text-teal-500 hover:underline break-words mx-auto" href={"http://localhost:5000/" + link.hash}>
                    {"http://localhost:5000/" + link.hash}</a>
                </td>
                <td className="border px-8 py-4 flex justify-center">
                <button className="flex-shrink-0 bg-red-500 hover:bg-red-700
                 border-red-500 hover:border-red-700 text-sm border-4
                  text-white py-1 px-2 rounded" onClick={(e)=>handleDelete(e,link)}>
                    delete URL
                </button>
                </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      
    </div>
  );
}

export default URLform;
