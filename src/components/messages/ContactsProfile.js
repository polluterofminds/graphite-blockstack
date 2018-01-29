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
    // this.refresh = setInterval(() => this.fetchMine(), 1000);
    this.refresh = setInterval(() => this.fetchData(), 1000);
    // let combined = [{...this.state.myMessages, ...this.state.sharedMessages}]
    // this.setState({ combined: combined});
}

// componentDidUpdate() {
//   this.scrollToBottom();
// }

fetchData() {
const username = this.state.conversationUser;

  lookupProfile(username, "https://core.technofractal.com/v1/names")
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
  let link = '/documents/shared/';
  let user = this.state.username;
  let fullLink = link + user;
  const userData = blockstack.loadUserData();
  const person = new blockstack.Person(userData.profile);
  return (
    <div>
    <div className="navbar-fixed toolbar">
      <nav className="toolbar-nav">
        <div className="nav-wrapper">
          <a href="/contacts" className="brand-logo">Graphite.<img className="people" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9%0D%0AIjgiIHZpZXdCb3g9IjAgMCA4IDgiPgogIDxwYXRoIGQ9Ik01LjUgMGMtLjUxIDAtLjk1LjM1LTEu%0D%0AMjIuODguNDUuNTQuNzIgMS4yOC43MiAyLjEzIDAgLjI5LS4wMy41NS0uMDkuODEuMTkuMTEuMzgu%0D%0AMTkuNTkuMTkuODMgMCAxLjUtLjkgMS41LTJzLS42Ny0yLTEuNS0yem0tMyAxYy0uODMgMC0xLjUu%0D%0AOS0xLjUgMnMuNjcgMiAxLjUgMiAxLjUtLjkgMS41LTItLjY3LTItMS41LTJ6bTQuNzUgMy4xNmMt%0D%0ALjQzLjUxLTEuMDIuODItMS42OS44NC4yNy4zOC40NC44NC40NCAxLjM0di42Nmgydi0xLjY2YzAt%0D%0ALjUyLS4zMS0uOTctLjc1LTEuMTl6bS02LjUgMWMtLjQ0LjIyLS43NS42Ny0uNzUgMS4xOXYxLjY2%0D%0AaDV2LTEuNjZjMC0uNTItLjMxLS45Ny0uNzUtMS4xOS0uNDUuNTMtMS4wNi44NC0xLjc1Ljg0cy0x%0D%0ALjMtLjMyLTEuNzUtLjg0eiIKICAvPgo8L3N2Zz4=" alt="inbox" /></a>

          <ul id="nav-mobile" className="right">
          <ul id="dropdown1" className="dropdown-content">
            <li><a href="/profile">Profile</a></li>
            <li><a href="/shared-docs">Shared Files</a></li>
            <li><a href="/export">Export All Data</a></li>
            <li className="divider"></li>
            <li><a href="#" onClick={ this.handleSignOut }>Sign out</a></li>
          </ul>
          <ul id="dropdown2" className="dropdown-content">
            <li><a href="/documents"><i className="material-icons blue-text text-darken-2">description</i><br />Documents</a></li>
            <li><a href="/sheets"><i className="material-icons green-text text-lighten-1">grid_on</i><br />Sheets</a></li>
            <li className="hide"><a href="/contacts"><i className="material-icons text-lighten-1">email</i><br />Contacts</a></li>
          </ul>
            <li><a className="dropdown-button" href="#!" data-activates="dropdown2"><i className="material-icons apps">apps</i></a></li>
            <li><a className="dropdown-button" href="#!" data-activates="dropdown1"><img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" /><i className="material-icons right">arrow_drop_down</i></a></li>
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
          <Link to={'/contacts/conversations/' + this.state.username}><i className="material-icons orange-text accent-2 small">chat</i></Link>
          <Link to={fullLink}><i className="material-icons blue-text text-darken-2 small">description</i></Link>
          <Link to={'/shared-sheets/' + this.state.username}><i className="material-icons green-text text-lighten-1 small">grid_on</i></Link>
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
