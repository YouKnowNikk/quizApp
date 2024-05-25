import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function FinalSubmission() {
    return (
       <>
       <Navbar />
       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-3xl font-bold text-green-600 mb-6">
                    Your Test Has Been Submitted!
                </h3>
                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                    <Link to="/">Go To Home</Link>
                </button>
            </div>
        </div>
       </>
    );
}

export default FinalSubmission;
