import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import Signin from './Signin';
import Header from './Header';
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile,
  signUserOut,
} from 'blockstack';
const blockstack = require("blockstack");


export default class AppPage extends Component {

  constructor(props) {
  	super(props);
  }

  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {


    return (
      <div>
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !isUserSignedIn() ?
            <Signin handleSignIn={ this.handleSignIn } />
            :
            <div>
            <div className="row app-list container">
              <div className="col s12 m6">
                <a className="black-text" href="/documents">
                  <div id="apps" className="center-align card small app-card hoverable">
                    <p><i className="material-icons large blue-text text-darken-2">description</i></p>
                    <h4 className="app-headers">Documents</h4>
                  </div>
                </a>
              </div>
              <div className="col s12 m6">
                <a className="black-text" href="/sheets">
                  <div className="center-align card small app-card hoverable">
                    <p><i className="material-icons large green-text text-lighten-1">grid_on</i></p>
                    <h4 className="app-headers">Sheets</h4>
                  </div>
                </a>
              </div>
              <div className="col s12 m6">
                <a className="black-text" href="/contacts">
                  <div className="center-align card small app-card hoverable">
                    <p><i className="material-icons large purple-text lighten-3">contacts</i></p>
                    <h4 className="app-headers">Contacts</h4>
                  </div>
                </a>
              </div>
              <div className="col s12 m6">
                <a className="black-text" href="/conversations">
                  <div className="center-align card small app-card hoverable">
                    <p><i className="material-icons large orange-text accent-2">chat</i></p>
                    <h4 className="app-headers">Conversations</h4>
                  </div>
                </a>
              </div>
            </div>
            </div>
          }
        </div>
      </div>
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
