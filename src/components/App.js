import React, { Component, Link } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Profile from './Profile';
import Signin from './Signin';
import Header from './Header';
import Main from './documents/Main';
import Doc from './documents/Document';
import TestDoc from './documents/TestDoc';
import SingleDoc from './documents/SingleDoc';
import DeleteDoc from './documents/DeleteDoc';
import SharedDocs from './documents/SharedDocs';
import MainSheets from './sheets/MainSheets';
import SingleSheet from './sheets/SingleSheet';
import TestSheet from './sheets/TestSheet';
import DeleteSheet from './sheets/DeleteSheet';
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
            <Route exact path="/documents" component={Main} />
            <Route exact path="/test" component={TestDoc} />
            <Route exact path="/documents/doc/new" component={Doc} />
            <Route exact path="/documents/doc/:id" component={SingleDoc} />
            <Route exact path="/documents/doc/delete/:id" component={DeleteDoc} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/shared" component={SharedDocs} />
            <Route exact path="/sheets" component={MainSheets} />
            <Route exact path="/sheets/sheet/:id" component={SingleSheet} />
            <Route exact path="/sheets/sheet/delete/:id" component={DeleteSheet} />
            <Route exact path="/testsheet" component={TestSheet} />
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
