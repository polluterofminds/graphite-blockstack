import React, { Component } from "react";
import { Link, Route, withRouter} from 'react-router-dom';
import { Redirect } from 'react-router';
import Profile from "./Profile";
import Signin from "./Signin";
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
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';


export default class Export extends Component {
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
      value: [],
      sheetsHere: false,
      docsHere: false
    }

  }

  componentDidMount() {
    getFile("spread.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Files are here");
         this.setState({ sheets: JSON.parse(fileContents || '{}').sheets });
         this.setState({ sheetsHere: true });
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

      getFile("documents.json", {decrypt: true})
       .then((fileContents) => {
         if(fileContents) {
           console.log("Files are here");
           this.setState({ value: JSON.parse(fileContents || '{}').value });
           this.setState({ docsHere: true });
         } else {
           console.log("No saved files");
         }
       })
        .catch(error => {
          console.log(error);
        });
  }





  render() {
    const docs = this.state.value;
    const sheets = this.state.sheets;
    console.log(this.state.sheets);
    var dataDocs = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(docs));
    $('<a href="data:' + dataDocs + '" download="docsdownload.json">Download Docs</a>').appendTo('#doccontainer');
    var dataSheets = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sheets));
    $('<a href="data:' + dataSheets + '" download="sheetsdownload.json">Download Sheets</a>').appendTo('#sheetcontainer');

    console.log(this.state.sheets);
    console.log(this.state.value);
    const userData = blockstack.loadUserData();
    const person = new blockstack.Person(userData.profile);
    return (
      <div>
        <div className="navbar-fixed toolbar">
          <nav className="toolbar-nav">
            <div className="nav-wrapper">
              <a href="/documents" className="brand-logo">Graphite.<img className="pencil" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Black_pencil.svg/1000px-Black_pencil.svg.png" alt="pencil" /></a>

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
              </ul>
                <li><a className="dropdown-button" href="#!" data-activates="dropdown2"><i className="material-icons apps">apps</i></a></li>
                <li><a className="dropdown-button" href="#!" data-activates="dropdown1"><img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" /><i className="material-icons right">arrow_drop_down</i></a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="container exports">
        <div className="row">
          <div className="col s6 center-align">
            <div id="doccontainer" className="card export-card hoverable">

            </div>
          </div>
          <div className="col s6 center-align">
            <div id="sheetcontainer" className="card export-card hoverable">

            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }
}
