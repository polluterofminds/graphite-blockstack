import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  loadUserData,
  Person,
  signUserOut,
} from 'blockstack';
const blockstack = require('blockstack');
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Header extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
  	};
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

  renderHeader() {
    const { handleSignOut } = this.props;
    const { handleSignIn } = this.props;
    if (blockstack.isUserSignedIn()) {
      const userData = blockstack.loadUserData();
      console.log('userData', userData);

      const person = new blockstack.Person(userData.profile);
      console.log('person', person);
      return (
        <ul id="nav-mobile" className="right">
        <ul id="dropdown1" className="dropdown-content">
          <li><a href="/profile">Profile</a></li>
          <li><a href="/shared">Shared Files</a></li>
          <li className="divider"></li>
          <li><a href="#" onClick={ handleSignOut.bind(this) }>Sign out</a></li>
          </ul>
          <li><a className="dropdown-button" href="#!" data-activates="dropdown1"><img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" /><i className="material-icons right">arrow_drop_down</i></a></li>
        </ul>
      );
    } else {
      return(
        <ul id="nav-mobile" className="right">
          <li><a href="#" onClick={ handleSignIn.bind(this) }>Sign in</a></li>
          <li><a href="http://graphitedocs.com" target="_blank">About</a></li>
        </ul>
      );
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <a href="/" className="brand-logo">Graphite.<img className="pencil" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Black_pencil.svg/1000px-Black_pencil.svg.png" alt="pencil" /></a>
          {this.renderHeader()}
        </div>
      </nav>
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
