import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import "tailwindcss/tailwind.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';  

const hobbiesOptions = [
  { label: "Reading", value: "reading" },
  { label: "Travelling", value: "travelling" },
  { label: "Sports", value: "sports" },
  { label: "Music", value: "music" },
];

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const onSubmit = async (data) => {
    console.log(data);
    console.log(profilePicture, "profile picture");
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    formData.append("profilePicture", profilePicture);

    formData.append("country", selectedCountry?.value);
    formData.append("state", selectedState?.value);
    formData.append("city", selectedCity?.value);
    try {
      const response = await axios.post(
        "http://localhost:8000/users/register",
        formData
      );
      toast.success("User registered successfully", { autoClose: 2000 });
      console.log("Registration successful:", response.data);

      reset();
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        switch (status) {
            case 409:
              toast.error("User already exists", { autoClose: 2000 });
              break;
            case 400:
              toast.error("Invalid password", { autoClose: 2000 });
              break;
            default:
              toast.error("Registration error", { autoClose: 2000 });
              break;
        }
      } else {
        toast.error("Network error", { autoClose: 2000 });
      }
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file && !["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("profilePicture", {
        type: "manual",
        message: "Only JPG, JPEG, and PNG files are allowed.",
      });
      setProfilePicture(null);
    } else {
      setProfilePicture(file);
    }
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null);
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }))
    : [];

  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
        (city) => ({
          label: city.name,
          value: city.name,
        })
      )
    : [];

  const validateAge = (value) => {
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 5 || "user must be at least 5 years old";
  };

  const validatePassword = (value) => {
    return (
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/.test(value) ||
      "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
    );
  };

  const validateConfirmPassword = (value) => {
    return value === watch("password") || "Passwords do not match";
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register an account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First Name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.firstName && (
                <span className="text-red-600">{errors.firstName.message}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                {...register("lastName", { required: "Last name is required" })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.lastName && (
                <span className="text-red-600">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Enter a valid email",
                  },
                })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Mobile Number
            </label>
            <div className="mt-2">
              <input
                id="mobile"
                name="mobile"
                type="tel"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid mobile number with 10 digits",
                  },
                })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.mobile && (
                <span className="text-red-600">{errors.mobile.message}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  validate: validatePassword,
                })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: validateConfirmPassword,
                })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.confirmPassword && (
                <span className="text-red-600">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date of Birth
            </label>
            <div className="mt-2">
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                  validate: validateAge,
                })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.dateOfBirth && (
                <span className="text-red-600">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Gender
            </label>
            <div className="mt-2">
              <select
                id="gender"
                name="gender"
                {...register("gender", { required: "Gender is required" })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-red-600">{errors.gender.message}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Country
            </label>
            <div className="mt-2">
              <Select
                id="country"
                options={countries}
                onChange={handleCountryChange}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              State
            </label>
            <div className="mt-2">
              <Select
                id="state"
                options={states}
                onChange={handleStateChange}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              City
            </label>
            <div className="mt-2">
              <Select
                id="city"
                options={cities}
                onChange={handleCityChange}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Profile Picture
            </label>
            <div className="mt-2">
              <input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleProfilePictureChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.profilePicture && (
                <span className="text-red-600">
                  {errors.profilePicture.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="hobbies"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Hobbies
            </label>
            <div className="mt-2 space-y-2">
              {hobbiesOptions.map((hobby) => (
                <div key={hobby.value} className="flex items-center">
                  <input
                    id={hobby.value}
                    name="hobbies"
                    type="checkbox"
                    value={hobby.value}
                    {...register("hobbies", {
                      required: "Select at least one hobby",
                    })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={hobby.value}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {hobby.label}
                  </label>
                </div>
              ))}
              {errors.hobbies && (
                <span className="text-red-600">{errors.hobbies.message}</span>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <button
                type="button"
                onClick={() => reset()}
                className="w-full rounded-md bg-gray-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
      <div className="mt-4 text-center">
          Already a member? <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </div>
    </div>
  );
};

export default RegistrationForm;
