import React from 'react';
import { Link } from "react-router-dom";

import NotificationsBell from './NotificationsBell';

function NoNotifications() {
  return (
    <span className='dropdown-item' href='#'>No notifications</span>
  )
}

function Notifications({ notifications }) {
  return notifications.map(({ id, title }) => (
    <Link to={{ pathname: `/posts/${id}` }} key={id}>
      <span className='dropdown-item'>{title}</span>
    </Link>
  ));
}

function NotificationsDropdown({ notifications }) {
  function handleClick(e) {
    let node = e.target;
    while (node && !node.classList.contains('dropdown'))
      node = node.parentElement;
    node
      .querySelector('#notificationsMenu')
      .style.display = 'block';
  }

  return (
    <div className='dropdown' onClick={handleClick}>
      <NotificationsBell hasNotifications={notifications.length > 0} />
      <div id='notificationsMenu' className='dropdown-menu'>
        {notifications.length > 0 ?
          <Notifications notifications={notifications} /> :
          <NoNotifications />
        }
      </div>
    </div>
  );
}

export default NotificationsDropdown;
