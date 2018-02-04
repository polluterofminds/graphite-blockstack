import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Profile from "../Profile";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import Signin from "../Signin";
import Header from "../Header";
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile,
  signUserOut
} from 'blockstack';
import axios from 'axios';
import update from 'immutability-helper';
const Quill = ReactQuill.Quill;
const blockstack = require("blockstack");
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class ContactsProfile extends Component {
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
    loading: "",
    show: "hide",
    description: "",
    name: "",
    appsUsed: "",
    conversationUser: "",
    img: avatarFallbackImage
  }
}

componentWillMount() {
  if (isSignInPending()) {
    handlePendingSignIn().then(userData => {
      window.location = window.location.origin;
    });
  }
}

componentDidMount() {
  this.setState({receiver: loadUserData().username});
  let info = loadUserData().profile;
  if(info.image) {
    this.setState({ userImg: info.image[0].contentUrl});
  } else {
    this.setState({ userImg: avatarFallbackImage});
  }

  getFile("contact.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Contacts are here");
         this.setState({ contacts: JSON.parse(fileContents || '{}').contacts });
         let contact = this.state.contacts;
         const thisContact = contact.find((a) => { return a.contact == this.props.match.params.id});
         this.setState({ conversationUser: thisContact && thisContact.contact});
       } else {
         console.log("No contacts");
       }
     })
      .catch(error => {
        console.log(error);
      });
    this.fetchData();
    this.refresh = setInterval(() => this.fetchData(), 1000);
}

fetchData() {
const username = this.state.conversationUser;

  lookupProfile(username, "https://core.blockstack.org/v1/names")
    .then((profile) => {
      console.log(profile);
      let image = profile.image;
      if(image) {
        this.setState({ img: image[0].contentUrl });
      } else {
        this.setState({ img: avatarFallbackImage });
      }
      this.setState({
        person: new Person(profile),
        username: username,
        name: profile.name,
        description: profile.description,
        accounts: profile.accounts
      })
    })
    .catch((error) => {
      console.log('could not resolve profile')
    })
}

handleSignOut(e) {
  e.preventDefault();
  signUserOut(window.location.origin);
}

render() {
  console.log(this.state.accounts);
  let twitter = 'https://twitter.com/'
  let facebook = 'https://facebook.com/'
  let github = 'https://github.com/'
  let accounts = this.state.accounts;
  const userData = blockstack.loadUserData();
  const person = new blockstack.Person(userData.profile);
  return (
    <div>
    <div className="navbar-fixed toolbar">
      <nav className="toolbar-nav">
        <div className="nav-wrapper">
          <a href="/contacts" className="brand-logo"><i className="material-icons">arrow_back</i></a>


            <ul className="left toolbar-menu">
              <li><a href='/contacts'>Back to Contacts</a></li>
            </ul>

        </div>
      </nav>
    </div>
    <div className="container contact-page">

    <div className="col s12 m7">
    <div className="card medium horizontal">
      <div className="card-image">
        <img className="responsive-img" src={this.state.img} />
      </div>
      <div className="card-stacked">
        <div className="card-content">
          <h3 className="header">{this.state.name}</h3>
          <h5>{this.state.username}</h5>
          <p>{this.state.description}</p>
        </div>
        <div className="card-action">
          <a href='/conversations'><i className="material-icons orange-text accent-2 small">chat</i></a>
          <Link to={'/documents/shared/' + this.state.username}><i className="material-icons blue-text text-darken-2 small">description</i></Link>
          <Link to={'/sheets/shared/' + this.state.username}><i className="material-icons green-text text-lighten-1 small">grid_on</i></Link>
        </div>
      </div>
    </div>
  </div>
    </div>
    </div>
  );
}
}

// <input type="text" placeholder="Message here" value={this.state.newMessage} onChange={this.handleMessage} />
