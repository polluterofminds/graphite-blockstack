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
      <Header />
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !isUserSignedIn() ?
            <Signin handleSignIn={ this.handleSignIn } />
            :
            <div>
            <div className="row app-list">
              <div className="col s12 m6 l3 app-page">
                <a className="black-text" href="/documents">
                  <div id="apps" className="center-align app-card docs-card row">
                    <p className="col s3 m12"><i className="material-icons docs-icon large blue-text text-darken-2">description</i></p>
                    <h4 className="col m12 s9 app-headers">Documents</h4>
                    <h5>Create a new document or work on an existing document with full encryption.</h5>
                    <p className="col m12 s6"><button className="app-button">Open</button></p>
                  </div>
                </a>
              </div>
              <div className="col s12 m6 l3 app-page">
                <a className="black-text" href="/sheets">
                  <div className="center-align app-card row sheets-card">
                    <p className="col s3 m12"><i className="material-icons large sheets-icon green-text text-lighten-1">grid_on</i></p>
                    <h4 className="col m12 s9 app-headers">Sheets</h4>
                    <h5>Work on a sheet, run calculations, make plans, retain privacy.</h5>
                    <p className="col m12 s6"><button className="app-button">Open</button></p>
                  </div>
                </a>
              </div>
              <div className="col s12 m6 l3 app-page">
                <a className="black-text" href="/contacts">
                  <div className="center-align app-card row contacts-card">
                    <p className="col s3 m12"><i className="material-icons contacts-icon large purple-text lighten-3">contacts</i></p>

                    <h4 className="col m12 s9 app-headers">Contacts</h4>
                    <h5>Control who you share with and who can share with you.</h5>
                    <p className="col m12 s6"><button className="app-button">Open</button></p>
                  </div>
                </a>
              </div>
              <div className="col s12 m6 l3 app-page">
                <a className="black-text" href="/conversations">
                  <div className="center-align app-card row convos">
                    <p className="col s3 m12"><i className="material-icons conversations-icon large orange-text accent-2">chat</i></p>
                    <h4 className="col m12 s9 app-headers">Conversations</h4>
                    <h5>Encrypted messages without a central authority looking over your shoulder.</h5>
                    <p className="col m12 s6"><button className="app-button">Open</button></p>
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
