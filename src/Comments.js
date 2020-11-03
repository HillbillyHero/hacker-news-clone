import React, { Component } from 'react';
import { withRouter } from "react-router";
import axios from 'axios';

import Navbar from './Navbar';

import { NOTIFICATIONS } from './constants';
import { getItemUrl, getLocalStorageItem, hideNotificationDropdownListener } from './utils';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      comments: [],
      loading: true,
      notifications: [],
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getPost();
    }
  }
  
  componentDidMount() {
    this.getPost();
    document.addEventListener('click', hideNotificationDropdownListener); 
  }

  componentDidWillUnmount() {
    document.removeEventListener('click', hideNotificationDropdownListener);
  }

  getPost = () => {
    const id = this.props.match.params.id;
    return axios.get(getItemUrl(id))
      .then(res => {
        const post = res.data;
        const kidsRequests = post.kids.map(id => axios.get(getItemUrl(id)))
        axios.all(kidsRequests).then(res => {
          // TODO: recurse comment childern
          const comments = res.map(res => res.data);
          const notifications = getLocalStorageItem(NOTIFICATIONS)
          this.setState({
            post: post,
            comments: comments,
            notifications: notifications,
            loading: false,
          })
        });
      }).catch((e) => {
        console.log(e);
        this.props.history.push('/');
      })
  }

  renderLoading = () => {
    return <h1>Loading...</h1>
  }

  escapDangerousCharacters = (html) => {
    // Use this method to remove potential
    // Bugs like XSS
    return html;
  }

  renderComments = () => {
    return this.state.comments.map(c => (
      <div className="" key={c.id}>
        <b><p>{c.by} {c.time}</p></b>
        <p
          style={{ fontStyle: 'italic' }}
          dangerouslySetInnerHTML={{ __html: this.escapDangerousCharacters(c.text) }}
        >
        </p>
      </div>
    ));
  }

  renderPost = () => {
    const { post: { title, score }, notifications } = this.state;
    return (
      <div className='container'>
        <Navbar notifications={notifications} />
        <h3>Post HN: {title}</h3>
        <p>{score} points</p>
        <div className='card'>
          <div className='card-body'>
            {this.renderComments()}
          </div>
        </div>
      </div>
    ) 
  }

  render () {
    return (
      <>
        {this.state.loading ?
          this.renderLoading() : this.renderPost()
        }
      </>
    );
  }
}

export default withRouter(Comments);
