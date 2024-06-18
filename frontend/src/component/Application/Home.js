import React, { useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useSelector,useDispatch } from "react-redux";
import { getuser } from '../features/userSlice/UserAction';
import { useState } from 'react';


function Home() {
   const dispatch = useDispatch();
  const navigate = useNavigate()
  let user = useSelector(state=>state.userAuthReducer.user);
  const [error,setError] = useState()

  const fetchUser1 = useCallback(() =>{
    try{
       const resp = dispatch(getuser());
       if(resp.error){
        let errorsMessage = resp.payload.message;
               setError(errorsMessage)
       }
    }
    catch(error){
      console.log(error);
      setError(error.message)
    }
  },[dispatch])

  useEffect(() => {
    fetchUser1();
  }, [fetchUser1]);


  if (!user) {
    return <div>Loading...</div>;
  }

  if(error){
    return <div>{error}</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Navbar */}
     <Navbar/>

      {/* Main Content */}
      <div className="flex flex-col items-center mt-10">
        {/* Profile Picture */}
        <div className="w-40 h-40">
          <img 
            src={user?.data?.profilePicture} 
            alt="Profile" 
            className="rounded-full w-full h-full object-cover" 
          />
        </div>

        {/* Greeting */}
        <h1 className="text-2xl font-bold mt-4">
          {user?.data?.message ? `Happy Birthday, ${user?.data?.firstName}!` : `Hello, ${user?.data?.firstName}!`}
        </h1>

        {/* Start Quiz Button */}
        <button onClick ={()=>navigate('/quiz')}className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default Home;
