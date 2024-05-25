import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


function Home() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate()
  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users/getuser', {
        withCredentials: true // Include cookies in the request
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  
console.log(user);
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
