
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RegistrationForm from '../userCreds/RegistrationForm'
import LoginForm from '../userCreds/LoginForm'
import ResetPasswordForm from '../userCreds/ResetPassword'

function PortalConfig() {
  return (
   <Routes>
    <Route path='/' element={<p>Home Page</p>}/>
    <Route path = '/registration' element={<RegistrationForm/>}/>
    <Route path='/login' element ={<LoginForm/>}/>
    <Route path ="reset-password" element= {<ResetPasswordForm/>}/>
   </Routes>
  )
}

export default PortalConfig