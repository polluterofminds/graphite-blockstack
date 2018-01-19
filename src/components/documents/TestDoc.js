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

export default class TestDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      messages: [],
      verification: [],
      complete: true,
      page: 0
    }
    this.saveIds = this.saveIds.bind(this);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
    this.postData();
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

  postData = () => {
    this.setState({complete: false})
    let page = this.state.page;

    let link = "https://core.blockstack.org/v1/names?page="
      axios
        .get(
          link + page.toString()
        )
        .then(res => {
          this.setState({ ids: [...this.state.ids, res.data] });
        })
        .then(() => {
          page = page +1;
          this.setState({complete: true})
          this.setState({page: page})
          if(page < 780){
            this.postData();
          } else if (page >779) {
            this.saveIds();
            this.setState({complete: true});
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

  componentDidMount() {
    // if(this.state.complete == true) {
    //   this.postData();
    //   this.refresh = setInterval(() => this.postData(), 1800000);
    }



  render() {
    console.log(this.state.ids);
    console.log(this.state.page);
    return (
      <div className="docs">
        <h1>Heyo</h1>
        <button onClick={this.saveIds}>Save</button>
      </div>
    );
  }
}
