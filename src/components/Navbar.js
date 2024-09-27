import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 
// Import the merged CSS file

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Yogify</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/upcoming-classes">Upcoming Classes</Link>
        </li>
        <li>
          <Link to="/instructor-dashboard">Instructor Dashboard</Link>
        </li>
        {/* <li>
          <Link to="/user-dashboard">User Dashboard</Link>
        </li> */}
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;