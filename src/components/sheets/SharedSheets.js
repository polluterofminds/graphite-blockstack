import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Profile from '../Profile';
import Signin from '../Signin';
import Header from '../Header';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile
} from 'blockstack';
import update from 'immutability-helper';
const blockstack = require("blockstack");
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class SharedSheets extends Component {

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
      username: "",
      contacts: [],
      filteredContacts: [],
      title : "",
      grid: [
        []
      ],
      updated: "",
      words: "",
      index: "",
      save: "",
      loading: "hide",
      printPreview: false,
      autoSave: "Saved",
      senderID: "",
      sheets: [],
      filteredValue: [],
      tempDocId: "",
      redirect: false,
      loading: "hide",
      receiverID: "",
      senderID: "",
      show: "",
      hide: "",
      hideButton: ""
    }

    this.fetchData = this.fetchData.bind(this);
    this.handleIDChange = this.handleIDChange.bind(this);
    this.pullData = this.pullData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleaddItem = this.handleaddItem.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
  }

  componentDidMount() {
    getFile("contact.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Contacts are here");
         this.setState({ contacts: JSON.parse(fileContents || '{}').contacts });
         this.setState({ filteredContacts: this.state.contacts });
       } else {
         console.log("No contacts");
       }
     })
      .catch(error => {
        console.log(error);
      });

    getFile("spread.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         this.setState({ sheets: JSON.parse(fileContents || '{}').sheets });
       } else {
         console.log("Nothing shared");
       }
     })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
    });
  }

  handleaddItem() {
    this.setState({ show: "hide" });
    this.setState({ hideButton: "hide", loading: "" })
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const rando = Date.now();
    const object = {};
    object.title = this.state.title;
    object.content = this.state.grid;
    object.id = rando;
    object.created = month + "/" + day + "/" + year;

    this.setState({ sheets: [...this.state.sheets, object] });
    this.setState({ tempDocId: object.id });
    this.setState({ loading: "" });
    // this.setState({ confirm: true, cancel: false });
    setTimeout(this.saveNewFile, 500);
    // setTimeout(this.handleGo, 700);
  }

  saveNewFile() {
    putFile("spread.json", JSON.stringify(this.state), {encrypt:true})
      .then(() => {
        console.log("Saved!");
        window.location.replace("/sheets");
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
  }

  fetchData() {
    const username = this.state.senderID;

      lookupProfile(username, "https://core.blockstack.org/v1/names")
        .then((profile) => {
          this.setState({
            person: new Person(profile),
            username: username
          })
        })
        .catch((error) => {
          console.log('could not resolve profile')
          this.setState({ loading: "hide" });
          Materialize.toast('Could not find user', 2000);
          setTimeout(this.windowRefresh, 2000);
        })
      //TODO Figure out multi-player decryption
      const options = { username: this.state.senderID, zoneFileLookupURL: "https://core.blockstack.org/v1/names"}

      getFile('sharedsheet.json', options)
        .then((file) => {
          const doc = JSON.parse(file || '{}');
          console.log(doc.title);
          this.setState({ title: doc.title, grid: doc.content, receiverID: doc.receiverID })
          this.setState({ show: "hide", loading: "hide", hideButton: ""});
        })
        .catch((error) => {
          console.log('could not fetch');
          this.setState({ loading: "hide" });
          Materialize.toast('Nothing shared', 2000);
          setTimeout(this.windowRefresh, 2000);
        })
        .then(() => {
          this.setState({ isLoading: false })
        })
    }

  windowRefresh() {
    window.location.reload(true);
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

  handleIDChange(e) {
    this.setState({ senderID: e.target.value })
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  handleChange(value) {
    this.setState({ content: value })
  }

  pullData() {
    this.fetchData();
    this.setState({ hideButton: "hide", loading: "" });
  }


  render() {
      const show = this.state.show;
      const hideButton = this.state.hideButton;
      let value = this.state.value;
      console.log(loadUserData().username);
      const loading = this.state.loading;
      let contacts = this.state.filteredContacts;
      let link = '/sheets/shared/';
      let user = this.state.senderID;
      let fullLink = link + user;
      const userData = blockstack.loadUserData();
      const person = new blockstack.Person(userData.profile);

      return (
        <div>
        <div className="navbar-fixed toolbar">
          <nav className="toolbar-nav">
            <div className="nav-wrapper">
              <a href="/sheets" className="brand-logo">Graphite.<img className="calculator" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9%0D%0AIjgiIHZpZXdCb3g9IjAgMCA4IDgiPgogIDxwYXRoIGQ9Ik0uMDkgMGMtLjA2IDAtLjA5LjA0LS4w%0D%0AOS4wOXY3LjgxYzAgLjA1LjA0LjA5LjA5LjA5aDYuODFjLjA1IDAgLjA5LS4wNC4wOS0uMDl2LTcu%0D%0AODFjMC0uMDYtLjA0LS4wOS0uMDktLjA5aC02Ljgxem0uOTEgMWg1djJoLTV2LTJ6bTAgM2gxdjFo%0D%0ALTF2LTF6bTIgMGgxdjFoLTF2LTF6bTIgMGgxdjNoLTF2LTN6bS00IDJoMXYxaC0xdi0xem0yIDBo%0D%0AMXYxaC0xdi0xeiIgLz4KPC9zdmc+" alt="calculator" /></a>

              <ul id="nav-mobile" className="right">
              <ul id="dropdown1" className="dropdown-content">
                <li><a href="/profile">Profile</a></li>
                <li><a href="/shared-sheets">Shared Files</a></li>
                <li><a href="/export">Export All Data</a></li>
                <li className="divider"></li>
                <li><a href="#" onClick={ this.handleSignOut }>Sign out</a></li>
              </ul>
              <ul id="dropdown2" className="dropdown-content">
              <li><a href="/documents"><i className="material-icons blue-text text-darken-2">description</i><br />Documents</a></li>
              <li><a href="/sheets"><i className="material-icons green-text text-lighten-1">grid_on</i><br />Sheets</a></li>
              <li><a href="/contacts"><i className="material-icons purple-text lighten-3">contacts</i><br />Contacts</a></li>
              <li><a href="/conversations"><i className="material-icons orange-text accent-2">chat</i><br />Conversations</a></li>
              </ul>
                <li><a className="dropdown-button" href="#!" data-activates="dropdown2"><i className="material-icons apps">apps</i></a></li>
                <li><a className="dropdown-button" href="#!" data-activates="dropdown1"><img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" /><i className="material-icons right">arrow_drop_down</i></a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className={show}>
          <div className="container">
            <h3 className="center-align">Shared Sheets</h3>
            <div className="card center-align shared">
              <h6>Enter the Blockstack user ID of the person who shared the file(s) with you</h6>
              <input className="" placeholder="Ex: JohnnyCash.id" type="text" onChange={this.handleIDChange} />
              <div className={hideButton}>
                <Link to={fullLink}><button className="btn black">Find Files</button></Link>
              </div>
              <div className={loading}>
                <div className="preloader-wrapper small active">
                    <div className="spinner-layer spinner-green-only">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div><div className="gap-patch">
                        <div className="circle"></div>
                      </div><div className="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <h5 className="center-align">Or select from your contacts</h5>
          <div className="shared-contacts row">
          {contacts.slice(0).reverse().map(contact => {
              return (
                <div key={contact.contact} className="col s6 m3">

                  <div className="card small renderedDocs">
                  <Link to={'/sheets/shared/'+ contact.contact} className="black-text">
                    <div className="center-align card-content">
                      <p><img className="responsive-img circle profile-img" src={contact.img} alt="profile" /></p>
                    </div>
                  </Link>
                    <div className="card-action">

                      <Link to={'/sheets/shared/'+ contact.contact}><a className="black-text">{contact.contact}</a></Link>
                    </div>
                  </div>
                </div>
              )
            })
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
