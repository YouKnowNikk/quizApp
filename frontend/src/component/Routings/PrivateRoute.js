
import React from 'react';
import {  Navigate } from 'react-router-dom';

const PrivateRoute = ({Component}) => {
  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };

  
  const isAuthenticated = getCookie('accessToken') ? true : false;
  
  return (
    <>
      {isAuthenticated ? <Component/> : <Navigate to="/login" />}
    </>
     
    
    
  );
};

export default PrivateRoute;
