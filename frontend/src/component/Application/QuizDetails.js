import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming Navbar is a separate component

const QuizDetails = () => {
  const { id } = useParams();
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/quiz/quiz/${id}`, {
          withCredentials: true
        });
        setQuizDetails(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error fetching quiz details: {error.message}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
        <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Quiz Details</h2>
          <p className="mb-4"><strong>Quiz ID:</strong> {quizDetails._id}</p>
          <p className="mb-4"><strong>Score:</strong> {quizDetails.score}</p>
          <p className="mb-4"><strong>Date:</strong> {new Date(quizDetails.createdAt).toLocaleString()}</p>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Question</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Options</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Correct Option</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Selected Option</th>
              </tr>
            </thead>
            <tbody>
              {quizDetails.questions.map((question, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">{question.question}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <ul>
                      {question.options.map((option, idx) => (
                        <li key={idx}>{option}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {question.options[question.correctOption]}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {question.options[question.selectedOption]?question.options[question.selectedOption]:'N/A'}
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

export default QuizDetails;
