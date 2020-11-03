import React, { Component } from 'react';
import { withRouter } from "react-router";

import axios from 'axios';

import {
  UPDATES_URL,
  TOP_POSTS_URL,

  NOTIFICATIONS,
  SUBSCRIBED_POSTS,
  LAST_POSTS_POSITION,
  PREVIOUSLY_SEEN_POSTS,
} from './constants';

import {
  getItemUrl,
  getLocalStorageItem,
  hideNotificationDropdownListener
} from './utils';

import Post from './Post';
import Navbar from './Navbar';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      postsPosition: 0,
      notifications: [],
      subscribedPosts: [],
      postsLoadThreshold: 15,
      currentSlicedPosts: [],
      isShowingNotifications: false,
    }

    this.postsObserverRef = React.createRef();
    this.postsIntersectionObserver = new IntersectionObserver(this.postsIntersectionObserverCallback, { threshold: 0.5 })
  }

  componentDidMount() {
    this.getPosts().then(res => {
      const { postsPosition, postsLoadThreshold } = this.state;
      const posts = res.data;
      const postsRequests = posts
        .slice(postsPosition, postsPosition + postsLoadThreshold)
        .map(id => axios.get(getItemUrl(id)));
      axios.all(postsRequests)
        .then(res => {
          const subscribedPosts = getLocalStorageItem(SUBSCRIBED_POSTS);
          this.setState({
            posts: posts,
            loading: false,
            subscribedPosts: subscribedPosts,
            currentSlicedPosts: res.map(res => res.data),
          }, () => {
            if (this.postsObserverRef.current)
              this.postsIntersectionObserver.observe(this.postsObserverRef.current);
            
            document.addEventListener('click', hideNotificationDropdownListener);
          });
        });
    })
    this.checkForUpdates()
  }

  componentWillUnmount() {
    document.removeEventListener('click', hideNotificationDropdownListener);
  }

  getPosts = () => {
    return axios.get(TOP_POSTS_URL);
  }

  checkForUpdates = () => {
    return axios.get(UPDATES_URL)
      .then(res => {
        const subscribedPosts = getLocalStorageItem(SUBSCRIBED_POSTS);
        const updatedItems = res.data.items
          .filter(id => subscribedPosts[id])
          .map(id => axios.get(getItemUrl(id)))
        axios.all(updatedItems)
          .then(res => {
            const notifications = res.map(res => res.data)
            this.setState({ notifications: notifications }, () => {
              window.localStorage.setItem(NOTIFICATIONS, JSON.stringify(notifications));
            })
          })
      })
  }

  postsIntersectionObserverCallback = (entries) => {
    const entry = entries[0];
    if (entry.intersectionRatio > 0 && this.postsObserverRef.current) {
      this.postsIntersectionObserver.unobserve(this.postsObserverRef.current);

      const { posts, postsPosition, postsLoadThreshold, currentSlicedPosts } = this.state;
      const lastPostsPosition = postsPosition + postsLoadThreshold;
      const localStorageLastPostsPosition = window.localStorage.getItem(LAST_POSTS_POSITION);
      if (lastPostsPosition > localStorageLastPostsPosition) {
        window.localStorage.setItem(LAST_POSTS_POSITION, lastPostsPosition);
      }
      
      const postsRequests = posts
        .slice(postsPosition + postsLoadThreshold, postsPosition + postsLoadThreshold * 2)
        .map(id => axios.get(getItemUrl(id)));
      axios.all(postsRequests)
        .then(res => {
          if (lastPostsPosition > localStorageLastPostsPosition) {
            window.localStorage.setItem(
              PREVIOUSLY_SEEN_POSTS,
              JSON.stringify(currentSlicedPosts)
            );
          }

          const newCurrentSlicedPosts = currentSlicedPosts;
          newCurrentSlicedPosts.push(...res.map(res => res.data));
          this.setState({
            postsPosition: postsPosition + postsLoadThreshold,
            currentSlicedPosts: newCurrentSlicedPosts
          }, () => {
            if (this.postsObserverRef.current)
              this.postsIntersectionObserver.observe(this.postsObserverRef.current);
          });
        });
    }
  }

  handleBookmark = (id) => {
    const posts = getLocalStorageItem(SUBSCRIBED_POSTS);
    if (!posts[id]) {
      posts[parseInt(id)] = true
      window.localStorage.setItem(SUBSCRIBED_POSTS, JSON.stringify(posts));
      this.setState({ subscribedPosts: posts }, this.checkForUpdates)
    }
  }

  handleRemoveBookmark = (id) => {
    const posts = getLocalStorageItem(SUBSCRIBED_POSTS);
    if (posts[id]) {
      delete posts[id];
      const notifications = getLocalStorageItem(NOTIFICATIONS).filter(n => n.id !== id);
      this.setState({
        notifications: notifications,
        subscribedPosts: posts,
      }, () => {
        window.localStorage.setItem(SUBSCRIBED_POSTS, JSON.stringify(posts));
        window.localStorage.setItem(NOTIFICATIONS, JSON.stringify(notifications));
      })
    }
  }

  renderPosts = () => {
    const { currentSlicedPosts } = this.state;
    return (
      <div className='container'>
        <Navbar notifications={this.state.notifications} />
        <div className="list-group">
          {currentSlicedPosts.map((post, idx) => (
            <Post
              key={post.id}
              idx={idx}
              post={post}
              subscribedPosts={this.state.subscribedPosts}
              postsObserverRef={this.postsObserverRef}
              currentSlicedPosts={currentSlicedPosts}
              handleBookmark={this.handleBookmark}
              handleRemoveBookmark={this.handleRemoveBookmark}
            />
          ))}
        </div>
      </div>
    )
  }

  renderLoading = () => {
    return <h1>Loading...</h1>
  }

  render () {
    const { loading } = this.state;
    return loading ? this.renderLoading() : this.renderPosts()
  }
}

export default withRouter(Posts);
