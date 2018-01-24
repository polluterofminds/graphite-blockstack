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
  lookupProfile
} from "blockstack";
import axios from 'axios';

const blockstack = require("blockstack");
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class TestDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      approvedIds: [],
      outboundMessages: [],
      verification: [],
      onboarding: false
    }
    this.saveIds = this.saveIds.bind(this);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
  }

  componentDidMount() {
    getFile("ids.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Ids are here");
         this.setState({ ids: JSON.parse(fileContents || '{}').ids });
         console.log(this.state.ids);
       } else {
         console.log("No ids");
       }
     })
      .catch(error => {
        console.log(error);
      });
    }

    saveIds() {
      putFile("ids.json", JSON.stringify(this.state), {encrypt: true})
        .then(() => {
          console.log("Saved!");
        })
        .catch(e => {
          console.log("e");
          console.log(e);
        });
      }



  render() {
    const userData = blockstack.loadUserData();
    const person = new blockstack.Person(userData.profile);

    return (
      <div>
      <div className="navbar-fixed toolbar">
        <nav className="toolbar-nav">
          <div className="nav-wrapper">
            <a href="/sheets" className="brand-logo">Graphite.<img className="calculator" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9%0D%0AIjgiIHZpZXdCb3g9IjAgMCA4IDgiPgogIDxwYXRoIGQ9Ik0wIDB2MWw0IDIgNC0ydi0xaC04em0w%0D%0AIDJ2NGg4di00bC00IDItNC0yeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgLz4KPC9zdmc+" alt="email" /></a>

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
            </ul>
              <li><a className="dropdown-button" href="#!" data-activates="dropdown2"><i className="material-icons apps">apps</i></a></li>
              <li><a className="dropdown-button" href="#!" data-activates="dropdown1"><img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" /><i className="material-icons right">arrow_drop_down</i></a></li>
            </ul>
          </div>
        </nav>
      </div>

      <ul className="collection">
        <li className="collection-item avatar">
          <img src="images/yuna.jpg" alt="" className="circle" />
          <span className="title">Title</span>
          <p>First Line <br />
             Second Line
          </p>
          <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
        </li>
        <li className="collection-item avatar">
          <i className="material-icons circle">folder</i>
          <span className="title">Title</span>
          <p>First Line <br />
             Second Line
          </p>
          <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
        </li>
        <li className="collection-item avatar">
          <i className="material-icons circle green">insert_chart</i>
          <span className="title">Title</span>
          <p>First Line <br />
             Second Line
          </p>
          <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
        </li>
        <li className="collection-item avatar">
          <i className="material-icons circle red">play_arrow</i>
          <span className="title">Title</span>
          <p>First Line <br />
             Second Line
          </p>
          <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
        </li>
      </ul>

      </div>
    );
  }
}
