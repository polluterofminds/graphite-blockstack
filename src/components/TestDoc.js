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

export default class TestDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      textvalue: "",
      test:"",
      rando: "",
      confirm: false
    }
    this.handleaddItem = this.handleaddItem.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }

    this.edit = () => {
      this.setState({ confirm: false });
    }
  }

  componentDidMount() {
    blockstack.getFile("/testfile.json", true)
     .then((fileContents) => {
        this.setState({ value: JSON.parse(fileContents || '{}').value })
        console.log(this.state.value);
     })
      .catch(error => {
        console.log(error);
      });
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
    object.id = Math.floor((Math.random() * 2500) + 1);
    this.setState({ value: [...this.state.value, object] });
    this.setState({ confirm: true });
    // this.saveNewFile();
  };

  saveNewFile() {
    blockstack.putFile("/testfile.json", JSON.stringify(this.state), true)
      .then(() => {
        console.log(JSON.stringify(this.state));
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
    this.setState({ confirm: false });
  }

  edit() {
    location.reload();
  }

  renderButton() {
    if(this.state.confirm === false) {
      return(
        <div className="container">
          <div className="input-field card">
            <input type="text" onChange={this.handleTitleChange} />
          </div>
          <div className="center-align">
            <button className="btn black" onClick={this.handleaddItem}>
              Add Document
            </button>
          </div>
        </div>



      );
    } else if (this.state.confirm === true) {
      return(

        <div className="container">
          <div className="input-field card">
            <div className="center-align">
            <h6>Confirm Title:</h6>
            <strong><h5>{this.state.textvalue}</h5></strong>
            </div>
          </div>
          <div className="center-align">
            <Link to={"/"}><button className="btn grey">
              Cancel
            </button></Link>
            <button className="btn orange" onClick={this.saveNewFile}>
              Save It
            </button>
          </div>
        </div>

      );
    }
  }

  render() {
    console.log(this.state.value);
    let value = this.state.value;
    return (
      <div>
        <div className="container">
          {this.renderButton()}
        </div>
        <div className="row">
          {value.map(doc => {
            if (doc.title.length > 0) {
              return (
                <div key={doc.id} className="col s6 m3">
                  <div className="card">
                    <div className="center-align card-content">
                      <p><i className="large material-icons">short_text</i></p>
                    </div>
                    <div className="card-action">
                      <a className="black-text" href="#">{doc.title}</a>
                    </div>
                  </div>
                </div>
              )
            }
            })
          }
        </div>
      </div>
    );
  }
}

// <textarea
//   type="text"
//   id="textarea1"
//   className="materialize-textarea"
//   onChange={this.handleChange}
// />
