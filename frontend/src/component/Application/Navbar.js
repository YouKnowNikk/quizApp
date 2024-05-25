import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Icons for the hamburger menu

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
  return (
    <nav className="w-full bg-blue-500 p-4 text-white flex justify-between items-center">
      <div className="text-lg font-bold cursor-pointer" onClick={()=>navigate('/')}>Quiz App</div>
      <div className="hidden md:flex">
        <Link to="/start-quiz" className="mr-4">Start Quiz</Link>
        <Link to="/user-quizes" className="mr-4">Your Quizzes</Link>
        <Link to="/logout">Logout</Link>
      </div>
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
          {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-blue-500 w-full flex flex-col items-center py-2">
          <Link to="/start-quiz" className="py-2" onClick={() => setIsMenuOpen(false)}>Start Quiz</Link>
          <Link to="/your-quizzes" className="py-2" onClick={() => setIsMenuOpen(false)}>Your Quizzes</Link>
          <Link to="/logout" className="py-2" onClick={() => setIsMenuOpen(false)}>Logout</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
