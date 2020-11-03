import React from 'react';

const styles = {
  cursor: 'pointer',
  alignSelf: 'center'
}

function BookmarkFilledIcon({ onClick }) {
  return (
    <div
      style={styles}
      onClick={onClick}
    >
      <svg
        fill="#FC6725"
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        viewBox="0 0 16 16"
        className="bi bi-bookmark-fill"
      >
        <path
          d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5V2z"
          fillRule="evenodd"
        />
      </svg>
    </div>
  )
};

export default BookmarkFilledIcon;
