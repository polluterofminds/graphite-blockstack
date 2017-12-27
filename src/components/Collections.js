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
      loading: ""
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
    blockstack.getFile("/newDoc.json", true)
     .then((fileContents) => {
        this.setState({ value: JSON.parse(fileContents || '{}').value })
        console.log("loaded");
        this.setState({ loading: "hide" });
     })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    console.log(this.state.value);
    let value = this.state.value;
    const loading = this.state.loading;
    return (
        <div className="docs">
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
            <Link to={'/new'}><div className="card">
              <div className="center-align card-content">
                <p><i className="large material-icons">add</i></p>
              </div>
              <div className="card-action">
                <a className="black-text">New Document</a>
              </div>
            </div></Link>
          </div>
          {value.map(doc => {
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
