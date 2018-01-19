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
  signUserOut,
} from 'blockstack';

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
            <div className="row hero-image">
              <div className="container">
                <div className="col copy center-align s6">
                  <img className="splash" src="https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/collaboration2_8og0.svg" alt="collaboration" />
                  <p>Make something great today. Create a document. Create a spreadsheet. Share it, get feedback, get work done.</p>
                  <p className="center-align">
                    <a href="#apps" className="btn white-text black">Get started</a>
                  </p>
                  <img className="splash" src="https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/files1_9ool.svg" alt="documents" />
                  <p>Your documents, your files. They are all yours. Ecrypted and only available to others if you say they are.</p>
                </div>
                <div className="col s6">
                  <img className="" src="https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/working2_ce2b.svg" alt="work" />
                </div>
              </div>
            </div>
            <div className="row app-list container">
              <div className="col s6">
                <a href="/documents">
                  <div id="apps" className="center-align card small app-card hoverable">
                    <p><i className="material-icons large blue-text text-darken-2">description</i></p>
                    <h3 className="app-headers">Documents</h3>
                  </div>
                </a>
              </div>
              <div className="col s6">
                <a href="/sheets">
                  <div className="center-align card small app-card hoverable">
                    <p><i className="material-icons large green-text text-lighten-1">grid_on</i></p>
                    <h3 className="app-headers">Sheets</h3>
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
