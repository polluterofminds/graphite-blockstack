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
  lookupProfile
} from 'blockstack';

const blockstack = require("blockstack");

export default class SheetsCollections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sheets: [],
      filteredSheets: [],
      tempSheetId: "",
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
    getFile("spread.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Files are here");
         console.log(fileContents);
         this.setState({ sheets: JSON.parse(fileContents || '{}').sheets });
         this.setState({filteredSheets: this.state.sheets})
         this.setState({ loading: "hide" });
       } else {
         console.log("Nothing to see here");
         // this.setState({ value: {} });
         // this.setState({ filteredValue: {} })
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
    const rando = Date.now();
    const object = {};
    object.title = "Untitled";
    object.content = "";
    object.id = rando;
    object.created = month + "/" + day + "/" + year;

    this.setState({ sheets: [...this.state.sheets, object] });
    this.setState({ filteredSheets: [...this.state.filteredSheets, object] });
    this.setState({ tempSheetId: object.id });
    // this.setState({ confirm: true, cancel: false });
    setTimeout(this.saveNewFile, 500);
    // setTimeout(console.log(this.state.sheets), 1000);
  }
  filterList(event){
    var updatedList = this.state.sheets;
    updatedList = updatedList.filter(function(item){
      return item.title.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({filteredSheets: updatedList});
  }

  saveNewFile() {
    putFile("spread.json", JSON.stringify(this.state), {encrypt:true})
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

    let sheets = this.state.filteredSheets;
    const loading = this.state.loading;
    const link = '/sheets/sheet/' + this.state.tempSheetId;
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
        <h3 className="container center-align">Your Sheets</h3>
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
          {sheets.slice(0).reverse().map(sheet => {
              return (
                <div key={sheet.id} className="col s6 m3">

                  <div className="card small renderedDocs">
                  <Link to={'/sheets/sheet/'+ sheet.id} className="black-text">
                    <div className="center-align card-content">
                      <p><i className="spreadsheet-icon large green-text text-lighten-1 material-icons">grid_on</i></p>
                    </div>
                    </Link>
                    <div className="card-action">
                      <Link to={'/sheets/sheet/'+ sheet.id}><a className="black-text">{sheet.title.length > 17 ? sheet.title.substring(0,17)+"..." :  sheet.title}</a></Link>
                      <Link to={'/sheets/sheet/delete/'+ sheet.id}>

                          <i className="modal-trigger material-icons red-text delete-button">delete</i>

                      </Link>
                      <div className="muted">
                        <p>Last updated: {sheet.updated}</p>
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
