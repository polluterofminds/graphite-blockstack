import React, { Component, Link } from "react";
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
import jsPDF from 'jsPDF';
import html2canvas from 'html2canvas';
const wordcount = require("wordcount");
const blockstack = require("blockstack");

export default class SingleDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      textvalue : "",
      test:"",
      index: "",
      save: "",
      loading: "hide"
    }
    this.handleaddItem = this.handleaddItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
  }

  componentDidMount() {
    blockstack.getFile("/newDoc.json", true)
     .then((fileContents) => {
        this.setState({ value: JSON.parse(fileContents || '{}').value })
        console.log("loaded");
     }).then(() =>{
       let value = this.state.value;
       const thisDoc = value.find((doc) => { return doc.id == this.props.match.params.id});
       let index = thisDoc && thisDoc.id;
       function findObjectIndex(doc) {
           return doc.id == index;
       }
       this.setState({ test: thisDoc && thisDoc.content, textvalue: thisDoc && thisDoc.title, index: value.findIndex(findObjectIndex) })
     })
      .catch(error => {
        console.log(error);
      });
      this.enableTab('textarea1');
    }


  handleTitleChange(e) {
    this.setState({
      textvalue: e.target.value
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
    object.id = parseInt(this.props.match.params.id);
    this.setState({ value: [...this.state.value, this.state.value.splice(this.state.index, 1, object)]})
    console.log(this.state.value);
    this.setState({ loading: "show", save: "hide" });
    this.saveNewFile();
  };

  saveNewFile() {
    this.setState({ loading: "show" });
    this.setState({ save: "hide"});
    blockstack.putFile("/newDoc.json", JSON.stringify(this.state), true)
      .then(() => {
        console.log(JSON.stringify(this.state));
        this.setState({ loading: "hide" });
        location.href = '/';
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
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

  print(){
    const curURL = window.location.href;
    history.replaceState(history.state, '', '/');
    window.print();
    history.replaceState(history.state, '', curURL);
  }

  render() {
    const words = wordcount(this.state.test);
    const loading = this.state.loading;
    const save = this.state.save;
    return (
      <div>
        <div className="container docs">
          <div className="card doc-card">
            <div className="double-space doc-margin">
            <span className="btn grey small"
              onClick={this.print}>
              PRINT
              </span>
            <h5 className="align-left">
            <input className="print-title" type="text" value={this.state.textvalue} onChange={this.handleTitleChange} />
            </h5>
            <textarea
              data-autoresize
              type="text"
              id="textarea1"
              className="materialize-textarea"
              value={this.state.test}
              onChange={this.handleChange}
            />
            <div className="right-align wordcounter">
              <p>{words} words</p>
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
