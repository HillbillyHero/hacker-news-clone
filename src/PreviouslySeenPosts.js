import React, { Component } from 'react';

import Post from './Post';
import Navbar from './Navbar';

import { SUBSCRIBED_POSTS, PREVIOUSLY_SEEN_POSTS, NOTIFICATIONS } from './constants';
import { getLocalStorageItem, hideNotificationDropdownListener } from './utils';

class PreviouslySeenPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      notifications: [],
      subscribedPosts: [],
    }
  }

  componentDidMount() {
    const posts = getLocalStorageItem(PREVIOUSLY_SEEN_POSTS);
    const notifications = getLocalStorageItem(NOTIFICATIONS);
    const subscribedPosts = getLocalStorageItem(SUBSCRIBED_POSTS);
    if (posts && posts.length > 0)
      this.setState({
        posts: posts,
        notifications: notifications, 
        subscribedPosts: subscribedPosts,
      });
    
      
    document.addEventListener('click', hideNotificationDropdownListener); 
  }

  componentDidWillUnmount() {
    document.removeEventListener('click', hideNotificationDropdownListener);
  }

  renderLoading = () => {
    return <h1>Loading...</h1>
  }

  renderPosts = () => {
    if (this.state.posts.length === 0) {
      return <div>No previous seen posts</div>
    }
    return (
      this.state.posts.map((post, idx) => (
        <Post
          key={post.id}
          idx={idx}
          post={post}
          handleBookmark={null}
          subscribedPosts={this.state.subscribedPosts}
          currentSlicedPosts={[]}
          handleRemoveBookmark={null}
          // Need to hoist state to make Post reusable
          // Instead of hiding the bookmark
          hideBookmarks={true}
        />
    )))
  };

  render () {
    return (
      <div className="container">
        <Navbar notifications={this.state.notifications} />
          <div className="list-group">
            {this.renderPosts()}
          </div>
      </div>
    );
  }
}

export default PreviouslySeenPosts;
