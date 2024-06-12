import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOTP, sendOTPByEmail } from "../utils/OtpGenrator.js"


//Utility function for User Controllers
const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};


export const genrateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccessToken();

    await user.save({ validateBeforeSave: false })
    return accessToken
  } catch (error) {
    throw new ApiError(500, " something wnet wrong in genrating tokens")
  }
}


const userRegistration = asyncHandler(async (req, res) => {
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

  if (!(firstName && lastName && email && mobile && password && dateOfBirth && gender && country && confirmPassword)) {
    throw new ApiError(400, "All fields are required");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }
  if (!isStrongPassword(password)) {
    throw new ApiError(400, "Password should be strong with minimum 8 characters, special character, and number");
  }
  const existingUser = await User.findOne({ email });
  const profilePicturePath = req.file?.path;
  const Avtar = await uploadOnCloudinary(profilePicturePath);
  if (existingUser) {
    if (existingUser.isRegistrationConfirmed) {
      throw new ApiError(409, "User already exists");
    } else {

      const otp = generateOTP();
      try {
        await sendOTPByEmail(email, otp, firstName);
      } catch (emailError) {
        throw new ApiError(500, "Failed to send OTP email. Please try again.");
      }
     
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.mobile = mobile;
      existingUser.password = password;
      existingUser.dateOfBirth = dateOfBirth;
      existingUser.gender = gender;
      existingUser.country = country;
      existingUser.state = state;
      existingUser.city = city;
      existingUser.hobbies = hobbies;
      existingUser.profilePicture = profilePicturePath ? Avtar.url : existingUser.profilePicture;
      existingUser.otp = otp;
      existingUser.otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

      await existingUser.save();
      return res.status(200).json(new ApiResponse(200, existingUser, "User registration updated. Please check your email for the OTP."));
    }
  }

  
  if (!profilePicturePath) {
    throw new ApiError(400, "Profile Picture is required");
  }
  

  const user = new User({
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
    profilePicture: Avtar.url,
  });

  const otp = generateOTP();
  try {
    await sendOTPByEmail(email, otp, firstName);
  } catch (emailError) {
    throw new ApiError(500, "Failed to send OTP email. Please try again.");
  }
  user.otp = otp;
  user.otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
  const createdUser = await user.save();

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully. Please check your email for the OTP."));
});


const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isRegistrationConfirmed = user.isRegistrationConfirmed;
  const ispasswordValid = await user.isPasswordCorrect(password);
  
  if (!ispasswordValid) {
    throw new ApiError(401, "Invalid Password")
  }

  if (!isRegistrationConfirmed) {
    throw new ApiError(400, "User registration not confirmed. Please verify your email.")
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

//OTP GEnration Controllers
const verifyOtp = asyncHandler(async (req, res) => {

  const { email, otp } = req.body;
  console.log(email);
  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(400,'User not found' )
  }
  if (user.otp !== otp || user.otpExpiration <= new Date()) {
    throw new ApiError(400,'Invalid or expired OTP' )
   
  }

  if (user.isOTPUsed) {
    throw new ApiError(400,'OTP already used')
  }
  user.isOTPUsed = true;
  await user.save();
  user.isRegistrationConfirmed = true;
  await user.save();
  res.status(200).json(new ApiResponse(200, "", 'OTP verified successfully'));
  
});


const resendOtp = asyncHandler(async (req, res) => {

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (user.isRegistrationConfirmed) {
    throw new ApiError(204, "user already registered");
  }

  const timeSinceLastOTP = new Date() - user.otpSentTimestamp;
  const minTimeBetweenOTPs = 2 * 60 * 1000;

  if (timeSinceLastOTP < minTimeBetweenOTPs) {
    return new ApiError(403, "Please wait 2 min for new OTP request");
  }

  const newOTP = generateOTP();
  user.otp = newOTP;
  user.otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendOTPByEmail(email, newOTP, user.fullName);

  res.status(200).json(new ApiResponse(200, "", "new otp sent succesfully"));

});


//USer Retrival Controllers
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
export { userRegistration, userLogin, verifyOtp, getUser, resendOtp }