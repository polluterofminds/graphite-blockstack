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

      const options = { username: this.state.senderID}

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

  renderView() {

    const loading = this.state.loading;
    const save = this.state.save;
    const hide = this.state.hide;
    const autoSave = this.state.autoSave;
    const shareModal = this.state.shareModal;
    const hideButton = this.state.hideButton;


    if(this.state.receiverID == loadUserData().username) {
      return(
        <div>
        <div className="navbar-fixed toolbar">
          <nav className="toolbar-nav">
            <div className="nav-wrapper">
              <a href="/sheets" className="brand-logo"><i className="material-icons">arrow_back</i></a>

            </div>
          </nav>
        </div>
        <div className="">
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

          <div className="card sharedSheet">
            <div className="center-align">
            <div className={hideButton}>
              <button onClick={this.handleaddItem} className="btn addButton black center-align">Add to Your Sheets</button>
            </div>
              <p className="center-align print-view">
              {this.state.title}
              </p>
              <p>
              <i className="spreadsheet-icon large green-text text-lighten-1 material-icons">grid_on</i>
              </p>
              <p>
              Created by {this.state.senderID}
              </p>
              </div>
              </div>
        </div>

        </div>
      );
    } else {
      return(
        <div>
          <div className="navbar-fixed toolbar">
            <nav className="toolbar-nav">
              <div className="nav-wrapper">
                <a href="/sheets" className="brand-logo"><i className="material-icons">arrow_back</i></a>

              </div>
            </nav>
          </div>
            <h4 className="center-align">Nothing shared</h4>
        </div>
      );
    }

  }


  render() {
    const show = this.state.show;
    const hideButton = this.state.hideButton;
    let value = this.state.value;
    console.log(loadUserData().username);
    const loading = this.state.loading;

    return (
      <div>
      <div className={show}>
        <div className="container">
          <div className="card center-align shared">
            <h6>Enter the Blockstack user ID of the person who shared the file with you</h6>
            <input className="" placeholder="Ex: JohnnyCash.id" type="text" onChange={this.handleIDChange} />
            <div className={hideButton}>
              <button onClick={this.pullData} className="btn black">Find File</button>
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
        {this.renderView()}
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
