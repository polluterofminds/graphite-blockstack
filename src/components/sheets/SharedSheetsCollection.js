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
const { encryptECIES, decryptECIES } = require('blockstack/lib/encryption');
const { getPublicKeyFromPrivate } = require('blockstack');
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class SharedSheetsCollection extends Component {
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
      sharedSheets: [],
      shareFile: [],
      sheets: [],
      filteredSheets: [],
      tempSheetId: "",
      redirect: false,
      loading: "",
      user: "",
      filteredValue: [],
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
    getFile("spread.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Loaded");
         this.setState({ sheets: JSON.parse(fileContents || '{}').sheets });
         // this.setState({filteredValue: this.state.value})
         this.setState({ loading: "hide" });
       } else {
         console.log("No sheets");
         this.setState({ loading: "hide" });
       }
     })
      .catch(error => {
        console.log(error);
      });

    let fileID = loadUserData().username;
    let fileString = 'sharedsheets.json'
    let file = fileID.slice(0, -3) + fileString;
    this.setState({ user: this.props.match.params.id });
    const directory = '/shared/' + file;
    const options = { username: this.props.match.params.id, zoneFileLookupURL: "https://core.blockstack.org/v1/names"}
    const privateKey = loadUserData().appPrivateKey;
    getFile(directory, options)
     .then((fileContents) => {
       lookupProfile(this.state.user, "https://core.blockstack.org/v1/names")
         .then((profile) => {
           let image = profile.image;
           console.log(profile);
           if(profile.image){
             this.setState({img: image[0].contentUrl})
           } else {
             this.setState({ img: avatarFallbackImage })
           }
         })
         .catch((error) => {
           console.log('could not resolve profile')
         })
        this.setState({ shareFile: JSON.parse(decryptECIES(privateKey, JSON.parse(fileContents))) })
        console.log("loaded");
        this.save();
     })
      .catch(error => {
        console.log(error);
      });
  }

  save() {
    putFile("spread.json", JSON.stringify(this.state), {encrypt: true})
      .then(() => {
        console.log("saved");
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  renderView() {
    let sheets = this.state.shareFile;
    console.log(sheets.shareFile);
    let sheetLoop = sheets.shareFile;

    const loading = this.state.loading;

    const userData = blockstack.loadUserData();
    const person = new blockstack.Person(userData.profile);
    const img = this.state.img;
    if (sheetLoop) {
      return (
        <div>
          <div className="navbar-fixed toolbar">
            <nav className="toolbar-nav">
              <div className="nav-wrapper">
                <a href="/sheets" className="brand-logo"><i className="material-icons">arrow_back</i></a>


                  <ul className="left toolbar-menu">
                    <li><a>Sheets shared by {this.state.user}</a></li>
                  </ul>

              </div>
            </nav>
          </div>
          <div className="container docs">
          <div className="row">
            <div className="center-align">
              <img className="shared-img responsive-img circle" src={img} alt="profile" />
            </div>
            <h3 className="center-align">Sheets {this.state.user} shared with you</h3>
          {sheetLoop.slice(0).reverse().map(sheet => {
              return (
                <div key={sheet.id} className="col s6 m3">

                  <div className="card small renderedDocs">
                  <Link to={'/sheets/single/shared/'+ sheet.id} className="black-text">
                    <div className="center-align card-content">
                      <p><i className="large green-text text-lighten-1 material-icons">grid_on</i></p>
                    </div>
                    </Link>
                    <div className="card-action">
                      <Link to={'/sheets/single/shared/'+ sheet.id}><a className="black-text">{sheet.title.length > 17 ? sheet.title.substring(0,17)+"..." :  sheet.title}</a></Link>
                      <div className="muted">
                        <p>Shared on: {sheet.shared}</p>
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
    } else {
      return (
        <div>
        <div className="navbar-fixed toolbar">
          <nav className="toolbar-nav">
            <div className="nav-wrapper">
              <a href="/sheets" className="brand-logo"><i className="material-icons">arrow_back</i></a>


                <ul className="left toolbar-menu">
                  <li><a>Sheets shared by {this.state.user}</a></li>
                </ul>

            </div>
          </nav>
        </div>
        <div className="container docs">
          <h3 className="center-align">Nothing shared by {this.state.user}</h3>
        </div>
        </div>
      );
    }
  }


  render() {
    const loading = this.state.loading;
    const userData = blockstack.loadUserData();
    const person = new blockstack.Person(userData.profile);
    const img = this.state.img;

    return (
      <div>
        {this.renderView()}
      </div>
    );
  }
}
