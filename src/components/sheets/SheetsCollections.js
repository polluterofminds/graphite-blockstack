import React, { Component } from "react";
import { Link, Route, withRouter} from 'react-router-dom';
import { Redirect } from 'react-router';
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
  signUserOut,
} from 'blockstack';

const blockstack = require("blockstack");
const { getPublicKeyFromPrivate } = require('blockstack');
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class SheetsCollections extends Component {
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
      sheets: [],
      filteredSheets: [],
      tempSheetId: "",
      redirect: false,
      loading: "",
      alert: ""
    }
    this.handleaddItem = this.handleaddItem.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
    this.filterList = this.filterList.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
  }

  componentDidMount() {
    const publicKey = getPublicKeyFromPrivate(loadUserData().appPrivateKey)
    putFile('key.json', JSON.stringify(publicKey))
    .then(() => {
        console.log("Saved!");
        console.log(JSON.stringify(publicKey));
      })
      .catch(e => {
        console.log(e);
      });


    getFile("spread.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Files are here");
         this.setState({ sheets: JSON.parse(fileContents || '{}').sheets });
         this.setState({filteredSheets: this.state.sheets})
         this.setState({ loading: "hide" });
       } else {
         console.log("Nothing to see here");
         // this.setState({ value: {} });
         // this.setState({ filteredValue: {} })
         // console.log(this.state.value);
         this.setState({ loading: "hide" });
       }
     })
      .catch(error => {
        console.log(error);
      });
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  handleaddItem() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const rando = Date.now();
    const object = {};
    object.title = "Untitled";
    object.content = "";
    object.id = rando;
    object.created = month + "/" + day + "/" + year;

    this.setState({ sheets: [...this.state.sheets, object] });
    this.setState({ filteredSheets: [...this.state.filteredSheets, object] });
    this.setState({ tempSheetId: object.id });
    // this.setState({ confirm: true, cancel: false });
    setTimeout(this.saveNewFile, 500);
    // setTimeout(console.log(this.state.sheets), 1000);
  }
  filterList(event){
    var updatedList = this.state.sheets;
    updatedList = updatedList.filter(function(item){
      return item.title.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({filteredSheets: updatedList});
  }

  saveNewFile() {
    putFile("spread.json", JSON.stringify(this.state), {encrypt: true})
      .then(() => {
        console.log("Saved!");
        this.setState({ redirect: true });
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
  }

  handleClick() {
    this.setState({ alert: "hide" })
  }


  render() {
    const alert = this.state.alert;
    console.log(this.state.sheets);
    let sheets = this.state.filteredSheets;
    const loading = this.state.loading;
    const link = '/sheets/sheet/' + this.state.tempSheetId;
    if (this.state.redirect) {
      return <Redirect push to={link} />;
    } else {
      console.log("No redirect");
    }
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

      <div className={alert}>
        <div className="alert-message">
          <p>Graphite will update to SSL for enhanced security on Friday, February 9, 2018 at 10:00am Central Standard Time. Please <a href="/export">export your data</a> if you'd like to retain anything you've done so far in Graphite.</p>
          <a className="btn" onClick={this.handleClick}>Close message</a>
        </div>
      </div>

        <div className="docs">
        <div className="search card">
          <form className="searchform">
          <fieldset className="form-group searchfield">
          <input type="text" className="form-control form-control-lg searchinput" placeholder="Search" onChange={this.filterList}/>
          </fieldset>
          </form>
        </div>
          <div className="container">
            <div className={loading}>
              <div className="progress center-align">
                <p>Loading...</p>
                <div className="indeterminate"></div>
              </div>
            </div>
          </div>
        <h3 className="container center-align">Your Sheets</h3>
        <div className="row">
          <div className="col s6 m3">
            <a onClick={this.handleaddItem}><div className="card small">
              <div className="center-align card-content">
                <p><i className="addDoc large material-icons">add</i></p>
              </div>
              <div className="card-action">
                <a className="black-text">New Sheet</a>
              </div>
            </div></a>
          </div>
          {sheets.slice(0).reverse().map(sheet => {
              return (
                <div key={sheet.id} className="col s6 m3">

                  <div className="card small renderedDocs">
                  <Link to={'/sheets/sheet/'+ sheet.id} className="black-text">
                    <div className="center-align card-content">
                      <p><i className="spreadsheet-icon large green-text text-lighten-1 material-icons">grid_on</i></p>
                    </div>
                    </Link>
                    <div className="card-action">
                      <Link to={'/sheets/sheet/'+ sheet.id}><a className="black-text">{sheet.title.length > 17 ? sheet.title.substring(0,17)+"..." :  sheet.title}</a></Link>
                      <Link to={'/sheets/sheet/delete/'+ sheet.id}>

                          <i className="modal-trigger material-icons red-text delete-button">delete</i>

                      </Link>
                      <div className="muted">
                        <p>Last updated: {sheet.updated}</p>
                      </div>
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
