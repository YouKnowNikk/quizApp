import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };
  export const genrateAccessTokenAndRefreshToken=async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken =  user.genrateAccessToken();
       
        await user.save({ validateBeforeSave: false })
        return  accessToken
    } catch (error) {
        throw new ApiError (500, " something wnet wrong in genrating tokens")
    }
 }

 const userRegistration = asyncHandler( async (req,res)=>{
    const { 
        firstName, 
        lastName, 
        email, 
        mobile, 
        password, 
        dateOfBirth, 
        gender,
        country,
        state,
        city,
        hobbies,
        confirmPassword
      } = req.body;

      if (!(firstName && lastName && email && mobile && password && dateOfBirth && gender && country && state && city && hobbies && confirmPassword)) {
        throw new Error("All fields are required");
      }
      if (password !== confirmPassword) {
        throw new ApiError(400, "Password and confirm password do not match");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ApiError(400, "Enter a valid email address");
      }
      const isExistingUser = await User.findOne({ email });
      if(isExistingUser){
        throw new ApiError(409,"User already Exist")
      }
      if (!isStrongPassword(password)) {
        throw new ApiError(400, "Password should be strong with minimum 8 characters, special character, and number");
      }

      const profilePicturePath = req.file?.path;
      if(!profilePicturePath){
        throw new ApiError(400,"Profile Picture is required dekh bhai")
      }
      const Avtar = await uploadOnCloudinary(profilePicturePath);
      const user = await User.create({
        firstName, 
        lastName, 
        email, 
        mobile, 
        password, 
        dateOfBirth, 
        gender,
        country,
        state,
        city,
        hobbies,
        profilePicture:Avtar.url,
        
      })
      const createdUser = await User.findById(user._id).select("-password -refreshToken");
      if(!createdUser){
        throw new ApiError(500,"internal server error")
      }
      return res.status(201).json(new ApiResponse(201,createdUser,"user Register successfully"))
 })

 const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!(email && password)) {
      throw new ApiError(400, "Email and password are required");
    }
  
    const user = await User.findOne({ email });
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    const ispasswordValid = user.isPasswordCorrect(password);
    if(!ispasswordValid){
        throw new ApiError(401, "Invalid Password")
    }
  
   
    const accessToken = await genrateAccessTokenAndRefreshToken(user._id);
    const loggedInuser = await User.findById(user._id).select("-password ");
    const options = {
      // httpOnly: true,
      secure: false,  // Set to true if serving over HTTPS
      sameSite: 'Lax',  // or 'None' if cross-site
      path: '/',
    }
   
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInuser, accessToken
            },
            "User logged In Successfully"
        )
    )
  });


  const getUser = asyncHandler(async (req, res) => {
    try {
      const user = req.user;
  
      if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
      }
  
      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);
  
      const userBirthdateUTC = new Date(user.dateOfBirth);
      userBirthdateUTC.setUTCHours(0, 0, 0, 0);
  
      let message = "";
      if (todayUTC.getUTCMonth() === userBirthdateUTC.getUTCMonth() &&
          todayUTC.getUTCDate() === userBirthdateUTC.getUTCDate()) {
        message = "Happy Birthday!";
      }
  
      const userResponse = { ...user._doc, message };
  
      return res.status(200).json(new ApiResponse(200, userResponse, "User fetched successfully"));
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, null, "An error occurred while fetching the user"));
    }
  });
 export {userRegistration , userLogin,getUser}