import React from 'react';
import { Link } from "react-router-dom";
import NotificationsDropdown from './NotificationsDropdown';

function Navbar({ notifications }) {
  return (
    <nav className='navbar'>
      <h1 className="navbar-brand">
        Hacker News
      </h1>
      <ul className='navbar-nav mr-auto'>
        <li className='nav-item'>
          <Link className='nav-link' to={{ pathname: '/' }}>Top</Link>
        </li>
        <li className='nav-item'>
          <Link to={{ pathname: '/previouslySeenPosts' }}>
            <span className='nav-link' href='#'>Seen</span>
          </Link>
        </li>
      </ul>
      <NotificationsDropdown notifications={notifications} />
    </nav>
  )
}

export default Navbar;
