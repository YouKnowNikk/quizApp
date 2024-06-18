import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verifyOTP } from '../features/userSlice/UserAction';

function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const email = queryParams.get('email');
    const dispatch = useDispatch()
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsResendEnabled(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit =  async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const resp =  await dispatch(verifyOTP({email,otp}));
       
            if (resp.error) {
                let errorsMessage = resp.payload.message;
                toast.error(errorsMessage, { autoClose: 2000 });
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleResend = async () => {
        setIsResendEnabled(false);
        setTimer(120);
        try {
            await axios.post('http://localhost:8000/users/resendotp', { email });
        } catch (error) {
            console.error('Error resending OTP:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
                <div className="mb-4">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                        Enter OTP
                    </label>
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Submit OTP
                    </button>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={!isResendEnabled}
                        className={`px-4 py-2 ml-4 rounded-md focus:outline-none ${isResendEnabled
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                    >
                        Resend OTP
                    </button>
                </div>
                {timer > 0 && (
                    <div className="mt-4 text-sm text-gray-500">
                        Resend available in {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60} minutes
                    </div>
                )}
            </form>
            <ToastContainer />
        </div>
    );
}

export default VerifyOTP;
