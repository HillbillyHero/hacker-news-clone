import React, { Component } from 'react';
import {
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";

import './App.css';
import Posts from './Posts';
import Comments from './Comments';
import PreviouslySeenPosts from './PreviouslySeenPosts';

class App extends Component {
  render () {
    return (
      <Router>
        <div className='container'>
          <Switch>
            <Route exact path="/">
              <Posts />
            </Route>
            <Route path='/posts/:id'>
              <Comments />
            </Route>
            <Route path='/previouslySeenPosts'>
              <PreviouslySeenPosts />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
