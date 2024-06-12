
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RegistrationForm from '../userCreds/RegistrationForm'
import LoginForm from '../userCreds/LoginForm'
import ResetPasswordForm from '../userCreds/ResetPassword'
import PrivateRoute from './PrivateRoute'
import Home from '../Application/Home'
import Quiz from '../Application/Quiz'
import finalSubmission from '../Application/finalSubmission'
import UserQuizzes from '../Application/UserQuizzes'
import QuizDetails from '../Application/QuizDetails'
import VerifyOTP from '../userCreds/VerifyOTP'

function PortalConfig() {
  return (
 
      <Routes>
         <Route path="/registration" element={<RegistrationForm />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/reset-password" element={<ResetPasswordForm />} />
    <Route path='/verifyOTP' element = {<VerifyOTP/>}/>
    {/* Protect the Home route using PrivateRoute */}
    <Route path='/' element={<PrivateRoute Component ={Home} />} />
    <Route path='/quiz' element ={<PrivateRoute Component={Quiz}/>}/>
   <Route path='/finalSubmission' element = {<PrivateRoute Component={finalSubmission}/>}/>
   <Route path = '/user-quizes' element = {<PrivateRoute Component={UserQuizzes}/>}/>
   <Route path = "/quiz-details/:id"  element ={<PrivateRoute Component={QuizDetails} />}/>
  </Routes>
   
    
  )
}

export default PortalConfig