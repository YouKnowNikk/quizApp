import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const QuizComponent = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/questions/getquestions', {
                    withCredentials: true
                });
                setQuestions(response.data.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleOptionChange = (questionId, optionIndex) => {
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [questionId]: optionIndex,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        const submissionData = {
            questions: questions.map(question => ({
                questionId: question._id,
                selectedOption: selectedOptions[question._id] !== undefined ? selectedOptions[question._id] : null,
            }))
        };
       
        try {
            const response = await axios.post('http://localhost:8000/quiz/submission', submissionData, {
                withCredentials: true
            });
            console.log('Submission successful', response.data);
            navigate('/finalSubmission')
        } catch (error) {
            console.error('Error submitting quiz', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">Error fetching questions: {error.message}</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = selectedOptions[currentQuestion._id];

    return (
       <>
        {/* <Navbar/> */}
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="max-w-2xl w-full p-6 bg-white shadow-lg rounded-lg mb-6">
                <div>
                    <div className="text-xl font-semibold mb-4">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
                    <ul className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        className="form-radio text-blue-500"
                                        name={`question-${currentQuestion._id}`}
                                        value={index}
                                        checked={selectedOption === index}
                                        onChange={() => handleOptionChange(currentQuestion._id, index)}
                                    />
                                    <span>{option}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                End Quiz
            </button>
        </div>
       </>
    );
};

export default QuizComponent;
