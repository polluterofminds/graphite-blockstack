import React, { Component } from "react";
import { Link } from "react-router-dom";
import Profile from "../Profile";
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
} from "blockstack";
import Conversations from './Conversations';

const blockstack = require("blockstack");
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Contacts extends Component {
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
      messages: [],
      filteredContacts: [],
      contacts: [],
      redirect: false,
      newContact: "",
      add: false,
      loading: "hide",
      show: "",
      newContactImg: avatarFallbackImage
    }
    this.handleaddItem = this.handleaddItem.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
    this.handleNewContact = this.handleNewContact.bind(this);
    this.newContact = this.newContact.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
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
  }

  newContact() {
    this.setState({add: true});
  }

  handleaddItem() {
    this.setState({ loading: "", show: "hide" })
    let newContact = this.state.newContact
    lookupProfile(newContact, "https://core.blockstack.org/v1/names")
      .then((profile) => {
        let image = profile.image;
        console.log(profile);
        if(profile.image){
          this.setState({newContactImg: image[0].contentUrl})
        } else {
          this.setState({ newContactImg: avatarFallbackImage })
        }
      }).then(() => {
        const object = {};
        object.contact = this.state.newContact;
        object.img = this.state.newContactImg;
        console.log(object);
        this.setState({ contacts: [...this.state.contacts, object], add: false });
        this.setState({ filteredContacts: [...this.state.contacts, object], add: false });
        setTimeout(this.saveNewFile, 500);
      })
      .catch((error) => {
        console.log('could not resolve profile')
      })
  }

  saveNewFile() {
    putFile("contact.json", JSON.stringify(this.state), {encrypt: true})
      .then(() => {
        console.log("Saved!");
        this.setState({loading: "hide", show: "" });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  handleNewContact(e) {
    this.setState({ newContact: e.target.value })
  }

  filterList(event){
    var updatedList = this.state.contacts;
    updatedList = updatedList.filter(function(item){
      return item.contact.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({filteredContacts: updatedList});
  }


  renderView() {
    let contacts = this.state.filteredContacts;
    console.log(loadUserData().username);
    const userData = blockstack.loadUserData();
    const person = new blockstack.Person(userData.profile);
    let show = this.state.show;
    let loading = this.state.loading;

    if(this.state.add == true){
    return (
      <div className="add-contact">
        <div className="card card-add">
          <div className="add-new">
            <label>Add a Contact</label>
            <input type="text" placeholder="Ex: JohnnyCash.id" onChange={this.handleNewContact} />
            <div className={show}>
            <button className="btn" onClick={this.handleaddItem}>Add</button>
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
      </div>
    );
  } else {
    return (
      <div>
        <div className="docs">
        <div className="search card">
          <form className="searchform">
          <fieldset className="form-group searchfield">
          <input type="text" className="form-control form-control-lg searchinput" placeholder="Search" onChange={this.filterList}/>
          </fieldset>
          </form>
        </div>
          <h3 className="center-align">Your Contacts</h3>
          <div className="row">
            <div className="col s6 m3">
              <a onClick={this.newContact}><div className="card small">
                <div className="center-align card-content">
                  <p><i className="addDoc large material-icons">add</i></p>
                </div>
                <div className="card-action">
                  <a className="black-text">New Contact</a>
                </div>
              </div></a>
            </div>
            {contacts.slice(0).reverse().map(contact => {
                return (
                  <div key={contact.contact} className="col s6 m3">

                    <div className="card small renderedDocs">
                    <Link to={'/contacts/conversations/'+ contact.contact} className="black-text">
                      <div className="center-align card-content">
                        <p><img className="responsive-img circle profile-img" src={contact.img} alt="profile" /></p>
                      </div>
                    </Link>
                      <div className="card-action">
                        <Link to={'/contacts/conversations/'+ contact.contact}><a className="black-text">{contact.contact}</a></Link>
                        <Link to={'/contacts/delete/'+ contact.contact}>

                            <i className="modal-trigger material-icons red-text delete-button">delete</i>

                        </Link>
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
  }

  render(){
    const userData = blockstack.loadUserData();
    const person = new blockstack.Person(userData.profile);
    return(
      <div>
      <div className="navbar-fixed toolbar">
        <nav className="toolbar-nav">
          <div className="nav-wrapper">
            <a href="/contacts" className="brand-logo">Graphite.<img className="calculator" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9%0D%0AIjgiIHZpZXdCb3g9IjAgMCA4IDgiPgogIDxwYXRoIGQ9Ik0wIDB2MWw0IDIgNC0ydi0xaC04em0w%0D%0AIDJ2NGg4di00bC00IDItNC0yeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgLz4KPC9zdmc+" alt="inbox" /></a>

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
        {this.renderView()}
      </div>
    )
  }
}
