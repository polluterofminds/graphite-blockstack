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

export default class Collections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      textvalue: "",
      test:"",
      rando: "",
      loading: "",
      autoSave: false
    }
    this.handleaddItem = this.handleaddItem.bind(this);
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
    blockstack.getFile("documents.json", true)
     .then((fileContents) => {
        this.setState({ value: JSON.parse(fileContents || '{}').value })
        console.log(JSON.parse(fileContents || '{}').value);
        this.setState({ loading: "hide" });
     })
      .catch(error => {
        console.log(error);
      });
  }
  handleaddItem() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const rando = Math.floor((Math.random() * 2500) + 1);
    const object = {};
    object.title = "Untitled";
    object.content = "";
    object.id = rando;
    object.updated = month + "/" + day + "/" + year;
    this.setState({ value: [...this.state.value, object] });
    // this.setState({ confirm: true, cancel: false });
    setTimeout(this.saveNewFile, 500)
  }
  saveNewFile() {
    // this.setState({ loading: "show" });
    // this.setState({ save: "hide"});
    blockstack.putFile("documents.json", JSON.stringify(this.state), true)
      .then(() => {
        console.log(JSON.stringify(this.state));
        // location.href = '/documents/'+ this.state.rando;
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
  }

  renderAutoSave() {
    if (this.state.autoSave == true) {
      return (
        <div className="recovery-message center-align">
          <p><i className="material-icons warning">warning</i></p>
          <p>You have an unsaved document. Click <strong><a href="/recovery">here</a></strong> to access it and save.</p>
        </div>
      );
    } else {
      return;
    }
  }

  render() {
    let value = this.state.value;
    const loading = this.state.loading;
    return (
        <div className="docs">
          {this.renderAutoSave()}
          <div className="container">
            <div className={loading}>
              <div className="progress center-align">
                <p>Loading...</p>
                <div className="indeterminate"></div>
              </div>
            </div>
          </div>
        <h3 className="container center-align">Your documents</h3>
        <div className="row">
          <div className="col s6 m3">
            <a onClick={this.handleaddItem}><div className="card small">
              <div className="center-align card-content">
                <p><i className="addDoc large material-icons">add</i></p>
              </div>
              <div className="card-action">
                <a className="black-text">New Document</a>
              </div>
            </div></a>
          </div>
          {value.slice(0).reverse().map(doc => {
              return (
                <div key={doc.id} className="col s6 m3">

                  <div className="card small renderedDocs">
                  <Link to={'/documents/'+ doc.id} className="black-text">
                    <div className="center-align card-content">
                      <p><i className="large material-icons">short_text</i></p>
                    </div>
                    </Link>
                    <div className="card-action">
                      <Link to={'/documents/'+ doc.id}><a className="black-text">{doc.title.length > 17 ? doc.title.substring(0,17)+"..." :  doc.title}</a></Link>
                      <Link to={'/documents/delete/'+ doc.id}>

                          <i className="modal-trigger material-icons red-text delete-button">delete</i>

                      </Link>
                      <div className="muted">
                        <p>Last updated: {doc.updated}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}
