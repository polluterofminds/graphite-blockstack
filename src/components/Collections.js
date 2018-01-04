import React, { Component } from "react";
import { Link, Route, withRouter} from 'react-router-dom';
import { Redirect } from 'react-router';
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
      filteredValue: [],
      tempDocId: "",
      redirect: false,
      loading: ""
    }
    this.handleaddItem = this.handleaddItem.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
    this.filterList = this.filterList.bind(this);

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
       if(fileContents) {
         console.log("Files are here");
         this.setState({ value: JSON.parse(fileContents || '{}').value });
         this.setState({filteredValue: this.state.value})
         console.log(JSON.parse(fileContents || '{}').value);
         this.setState({ loading: "hide" });
       } else {
         console.log("Nothing to see here");
         // this.setState({ value: {} });
         // this.setState({filteredValue: {}})
         // console.log(this.state.value);
         this.setState({ loading: "hide" });
       }
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
    // object.title = "Untitled";
    object.content = "";
    object.id = rando;
    object.created = month + "/" + day + "/" + year;

    this.setState({ value: [...this.state.value, object] });
    this.setState({ filteredValue: [...this.state.filteredValue, object] });
    this.setState({ tempDocId: object.id });
    // this.setState({ confirm: true, cancel: false });
    setTimeout(this.saveNewFile, 500);
    // setTimeout(this.handleGo, 700);
  }
  filterList(event){
    var updatedList = this.state.value;
    updatedList = updatedList.filter(function(item){
      return item.title.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({filteredValue: updatedList});
  }

  saveNewFile() {
    blockstack.putFile("documents.json", JSON.stringify(this.state), true)
      .then(() => {
        console.log("Saved!");
        this.setState({ redirect: true });
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
  }


  render() {
    let value = this.state.filteredValue;
    const loading = this.state.loading;
    const link = '/documents/' + this.state.tempDocId;
    if (this.state.redirect) {
      return <Redirect push to={link} />;
    } else {
      console.log("No redirect");
    }


    return (
        <div className="docs">
        <div className="search card">
          <form className="searchform">
          <fieldset className="form-group searchfield">
          <input type="text" className="form-control form-control-lg searchinput" placeholder="Search" onChange={this.filterList}/>
          </fieldset>
          </form>
        </div>
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
