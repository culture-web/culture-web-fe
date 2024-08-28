import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="navbar flex-between align-center px-xlarge py-base">
      <button
        type="button"
        onClick={() => handleNavigate('/')}
        className="font-xlarge text-only-button red font-bold"
      >
        MusAIca
      </button>
      <div className={`nav-links font-large ${isOpen ? 'active' : ''}`}>
        <button
          type="button"
          onClick={() => handleNavigate('/')}
          className="text-only-button gray-underline"
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('/cultures')}
          className="text-only-button gray-underline"
        >
          Cultures
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('/about-us')}
          className="text-only-button gray-underline"
        >
          About Us
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('/community')}
          className="text-only-button gray-underline"
        >
          Community
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('/contact-us')}
          className="text-only-button gray-underline"
        >
          Contact Us
        </button>
      </div>
      <div className="menu" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-xlarge">Menu</span>
      </div>
    </nav>
  );
}

export default Navbar;
