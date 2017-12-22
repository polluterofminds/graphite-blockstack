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
import ReactQuill from 'react-quill';

const blockstack = require("blockstack");

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
    const object = {};
    object.title = this.state.textvalue;
    object.content = this.state.test;
    object.id = this.state.rando;
    this.setState({ value: [...this.state.value, object] });
    this.setState({ confirm: true, cancel: false });
    // this.saveNewFile();
  };

  saveNewFile() {
    this.setState({ loading: "show" });
    this.setState({ save: "hide"});
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

  renderButton() {
    if(this.state.confirm === false && this.state.cancel == false) {
      return(
        <div>
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
            </div>
          </div>
          </div>
          <div>
            <button className="btn black" onClick={this.handleaddItem}>
              Next
            </button>
          </div>
        </div>



      );
    } else if (this.state.confirm === true) {
      const loading = this.state.loading;
      const save = this.state.save;
      return(

        <div>
          <div className="card preview">
            <div className="doc-margin">
            <strong><h5>{this.state.textvalue}</h5></strong>
            <p className="double-space indent">{this.state.test.split('\n').map((item, key) => {
                return <span className="span-indent"key={item}>{item}<br/></span>
              })}
            </p>
            </div>
          </div>
          <div className="preview">
          <div className={save}>
            <button className="btn grey" onClick={this.handleCancel}>
              Cancel
            </button>
            <button className="btn orange" onClick={this.saveNewFile}>
              Looks Good
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

      );
    } else if(this.state.confirm == false && this.state.cancel == true) {
      const loading = this.state.loading;
      const save = this.state.save;
      return (
        <div>
          <div className="">
            <div className="card">
              <div className="double-space input-field">

              <input type="text" value={this.state.textvalue} onChange={this.handleTitleChange} />
              <div className="doc-margin">
              <textarea
                type="text"
                id="textarea1"
                className="materialize-textarea"
                value={this.state.test}
                onChange={this.handleChange}
              />
              </div>
              <div className={save}>
              <button className="btn black" onClick={this.handleaddItem}>
                Update
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

        </div>
      );
    }
  }

  render() {
    console.log(this.state.cancel);
    let value = this.state.value;
    return (
      <div>
        <div className="container docs">
          {this.renderButton()}
        </div>

      </div>
    );
  }
}
