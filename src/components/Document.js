import React, { Component } from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import Signin from "./Signin";
import Header from "./Header";
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut
} from "blockstack";

const blockstack = require("blockstack");
const wordcount = require("wordcount");

export default class Doc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      textvalue: "",
      test:"",
      rando: "",
      confirm: false,
      loading: "hide",
      save: "",
      cancel: false
    }
    this.handleaddItem = this.handleaddItem.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
    // this.enableTab('textarea1');
  }

  componentDidMount() {
    blockstack.getFile("/newDoc.json", true)
     .then((fileContents) => {
        this.setState({ value: JSON.parse(fileContents || '{}').value })
        console.log("loaded");
     })
      .catch(error => {
        console.log(error);
      });
    this.enableTab('textarea1');
  }

  handleTitleChange(e) {
    const rando = Math.floor((Math.random() * 2500) + 1);
    this.setState({
      textvalue: e.target.value
    });
    this.setState({
      rando: rando
    });
  }
  handleChange(e) {
    this.setState({
      test: e.target.value
    });
  }
  handleaddItem() {
    if(this.state.textvalue || this.state.test) {
      const object = {};
      object.title = this.state.textvalue;
      object.content = this.state.test;
      object.id = this.state.rando;
      this.setState({ value: [...this.state.value, object] });
      // this.setState({ confirm: true, cancel: false });
      this.setState({ loading: "show" });
      this.setState({ save: "hide"});
      setTimeout(this.saveNewFile, 500)
    } else {
      location.href = '/';
    }
  };

  saveNewFile() {
    // this.setState({ loading: "show" });
    // this.setState({ save: "hide"});
    blockstack.putFile("/newDoc.json", JSON.stringify(this.state), true)
      .then(() => {
        console.log(JSON.stringify(this.state));
        location.href = '/';
        this.setState({ confirm: false });
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
  }
  handleCancel() {
    this.setState({ confirm: false, cancel: true});

  }

  enableTab(id) {
      var el = document.getElementById(id);
      el.onkeydown = function(e) {
          if (e.keyCode === 9) { // tab was pressed

              // get caret position/selection
              var val = this.value,
                  start = this.selectionStart,
                  end = this.selectionEnd;

              // set textarea value to: text before caret + tab + text after caret
              this.value = val.substring(0, start) + '\t' + val.substring(end);

              // put caret at right position again
              this.selectionStart = this.selectionEnd = start + 1;

              // prevent the focus lose
              return false;

          }
      };
  }

  render() {
    const words = wordcount(this.state.test);
    const loading = this.state.loading;
    const save = this.state.save;

    return (
      <div>
      <div className="navbar-fixed toolbar">
        <nav className="toolbar-nav">
          <div className="nav-wrapper">
            <a onClick={this.handleaddItem} className="brand-logo"><i className="material-icons">arrow_back</i></a>
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
            <ul className="left toolbar-menu">
              <li><a href="sass.html">Toolbar</a></li>
              <li><a href="badges.html">Toolbar</a></li>
            </ul>
          </div>
        </nav>
      </div>
        <div className="container docs">
        <div className="card">
        <div className="input-field">
          <input type="text" placeholder="Title" onChange={this.handleTitleChange} />
          <div className="doc-margin">
            <textarea
              type="text"
              id="textarea1"
              placeholder="Write something great"
              className="materialize-textarea double-space"
              onChange={this.handleChange}
            />
            <div className="right-align wordcounter">
              <p>{words} words</p>
            </div>
          </div>
        </div>
        </div>
        <div>
          <div className={save}>
          <button className="btn black" onClick={this.handleaddItem}>
            Save
          </button>
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
  }
}
