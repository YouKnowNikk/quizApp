import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming Navbar is a separate component

const UserQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/quiz/user-quizzes', {
                    withCredentials: true
                });
                setQuizzes(response.data.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserQuizzes();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">Error fetching quizzes: {error.message}</div>;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
                <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Your Quizzes</h2>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Quiz ID</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Total Questions</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Score</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Total Score (%)</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map((quiz) => (
                                <tr key={quiz._id}>
                                    <td className="py-2 px-4 border-b border-gray-200">{quiz._id}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{quiz.totalQuestions}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{quiz.score}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{quiz.totalScore.toFixed(2)}%</td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        <Link to={`/quiz-details/${quiz._id}`} className="text-blue-500 hover:underline">View More</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default UserQuizzes;
