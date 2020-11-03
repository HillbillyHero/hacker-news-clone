import { BASE_URL } from './constants';

export function getItemUrl(id) {
  return `${BASE_URL}/item/${id}.json?print=pretty`;
}

export function getLocalStorageItem(prop) {
  let item = JSON.parse(window.localStorage.getItem(prop));
  return !item ? {} : item;
}

export function hideNotificationDropdownListener(e) {
  let node = e.target || null;
  while (node && !node.classList.contains('notifications-bell'))
    node = node.parentElement
  
  const notificationsMenu = document.getElementById('notificationsMenu');
  if (!node && notificationsMenu) notificationsMenu.style.display = 'none';
}
