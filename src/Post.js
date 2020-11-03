import React from 'react';
import { Link } from "react-router-dom";

import BookmarkIcon from './BookmarkIcon';
import BookmarkFilledIcon from './BookmarkFilledIcon';

function Post({
  idx,
  post,
  subscribedPosts,
  postsObserverRef,
  currentSlicedPosts,
  handleBookmark,
  handleRemoveBookmark,
  hideBookmarks,
}) {
  function renderBookmarks() {
    return (
      subscribedPosts[id] ?
        <BookmarkFilledIcon onClick={() => handleRemoveBookmark(id)} /> :
        <BookmarkIcon onClick={() => handleBookmark(id)} /> 
    )
  }

  const { id, by, title, score, descendants } = post;
  return (
    <div
      style={{ display: 'flex' }}
      ref={idx === currentSlicedPosts.length - 1 ? postsObserverRef : null}
      className='list-group-item list-group-item-action'
    >
      <b style={{ alignSelf: 'center', flex: 0 }}>{idx + 1}</b>
      <div style={{ paddingLeft: 16, flex: 2 }}>
        <p style={{ margin: 0 }} className="card-text">{title}</p>
        <p style={{ fontSize: 12 }} className="card-text">
          {score} points by {by} | {descendants} <Link to={{ pathname: `/posts/${id}` }}>comments</Link>
        </p>
      </div>
      {!hideBookmarks && renderBookmarks()}
    </div>
  )
}

export default Post;
