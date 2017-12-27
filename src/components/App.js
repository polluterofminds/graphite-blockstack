import React, { Component, Link } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Profile from './Profile';
import Signin from './Signin';
import Header from './Header';
import Main from './Main';
import Doc from './Document';
import TestDoc from './TestDoc';
import SingleDoc from './SingleDoc';
import DeleteDoc from './DeleteDoc';

import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
} from 'blockstack';

export default class App extends Component {

  constructor(props) {
  	super(props);
  }

  handleSignIn(e) {
    e.preventDefault();
    redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {
    return (
      <div>
      <BrowserRouter>
          <div className="main-container">
            <Header handleSignOut={ this.handleSignOut } handleSignIn={ this.handleSignIn } />
            <Route exact path="/" component={Main} />
            <Route exact path="/test" component={TestDoc} />
            <Route exact path="/new" component={Doc} />
            <Route exact path="/documents/:id" component={SingleDoc} />
            <Route exact path="/documents/delete/:id" component={DeleteDoc} />
          </div>
        </BrowserRouter>
      </div>
    );
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
