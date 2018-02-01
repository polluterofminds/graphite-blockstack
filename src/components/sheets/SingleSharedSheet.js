import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
import update from 'immutability-helper';
const wordcount = require("wordcount");
const blockstack = require("blockstack");
const { encryptECIES, decryptECIES } = require('blockstack/lib/encryption');
const { getPublicKeyFromPrivate } = require('blockstack');
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const Quill = ReactQuill.Quill;
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['Ubuntu', 'Raleway', 'Roboto', 'Lato', 'Open Sans', 'Montserrat'] ; // allow ONLY these fonts and the default
ReactQuill.Quill.register(Font, true);

export default class SingleSharedSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sheets: [],
      sharedFile: [],
      grid: [],
      title : "",
      user: "",
      content:"",
      updated: "",
      words: "",
      index: "",
      save: "",
      loading: "hide",
      printPreview: false,
      autoSave: "Saved",
      receiverID: "",
      shareModal: "hide",
      hideButton: "",
      shareFile: [],
      show: "",
      img: avatarFallbackImage
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleIDChange = this.handleIDChange.bind(this);
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
    getFile("spread.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         this.setState({ sheets: JSON.parse(fileContents || '{}').sheets });
         this.setState({ user: JSON.parse(fileContents || '{}').user });
         this.refresh = setInterval(() => this.getOther(), 1000);
       } else {
         console.log("No sheets");
       }
     })
      .catch(error => {
        console.log(error);
      });
      this.printPreview = () => {
        if(this.state.printPreview == true) {
          this.setState({printPreview: false});
        } else {
          this.setState({printPreview: true});
        }
      }
    }

getOther() {
  let fileID = loadUserData().username;
  let fileString = 'sharedsheets.json'
  let file = fileID.slice(0, -3) + fileString;
  const directory = '/shared/' + file;
  const options = { username: this.state.user, zoneFileLookupURL: "https://core.blockstack.org/v1/names"}
  getFile(directory, options)
  .then((fileContents) => {
   let privateKey = loadUserData().appPrivateKey;
    this.setState({ shareFile: JSON.parse(decryptECIES(privateKey, JSON.parse(fileContents))) })
    console.log("loaded");
    let allSheets = this.state.shareFile;
    let sheets = allSheets.shareFile;
    console.log("Check: " + sheets);
    const thisSheet = sheets.find((sheet) => { return sheet.id == this.props.match.params.id});
    let index = thisSheet && thisSheet.id;
    console.log(index);
    function findObjectIndex(sheet) {
        return sheet.id == index;
    }
    this.setState({ grid: thisSheet && thisSheet.content, title: thisSheet && thisSheet.title, index: sheets.findIndex(findObjectIndex) })
  })
  .then(() => {
    this.$el = $(this.el);
    this.$el.jexcel({
      data: this.state.grid,
      onchange: this.handleChange,
      minDimensions:[40,100],
      colWidths: [ ]
    });
    this.$el.jexcel('updateSettings', {
      cells: function (cell, col, row) {
          if (col > 0) {
              value = $('#my').jexcel('getValue', $(cell));
              val = numeral($(cell).text()).format('0,0.00');
              $(cell).html('' + val);
          }
      }
    });
  })
  .catch(error => {
    console.log(error);
  });
}

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }
  handleChange(value) {
      this.setState({ content: value })
    }

  handleIDChange(e) {
      this.setState({ receiverID: e.target.value })
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
      putFile("spread.json", JSON.stringify(this.state), {encrypt: true})
        .then(() => {
          console.log("Saved!");
          window.location.replace("/sheets");
        })
        .catch(e => {
          console.log("e");
          console.log(e);
        });
    }

  print(){
    const curURL = window.location.href;
    history.replaceState(history.state, '', '/');
    window.print();
    history.replaceState(history.state, '', curURL);
  }

  renderView() {

    const words = wordcount(this.state.content);
    const loading = this.state.loading;
    const save = this.state.save;
    const autoSave = this.state.autoSave;
    const shareModal = this.state.shareModal;
    const hideButton = this.state.hideButton;
    const show = this.state.show;
    var content = "<p style='text-align: center;'>" + this.state.title + "</p>" + "<div style='text-indent: 30px;'>" + this.state.content + "</div>";

    var htmlString = $('<html xmlns:office="urn:schemas-microsoft-com:office:office" xmlns:word="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">').html('<body>' +

    content +

    '</body>'

    ).get().outerHTML;

    var htmlDocument = '<html xmlns:office="urn:schemas-microsoft-com:office:office" xmlns:word="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><xml><word:WordDocument><word:View>Print</word:View><word:Zoom>90</word:Zoom><word:DoNotOptimizeForBrowser/></word:WordDocument></xml></head><body>' + content + '</body></html>';
    var dataUri = 'data:text/html,' + encodeURIComponent(htmlDocument);
    return(
    <div>
    <div className="navbar-fixed toolbar">
      <nav className="toolbar-nav">
        <div className="nav-wrapper">
          <a href="/shared-sheets" className="brand-logo"><i className="material-icons">arrow_back</i></a>
          <ul className="left toolbar-menu">
            <li className="black-text">{this.state.title}</li>
            <li className={hideButton}><a onClick={this.handleaddItem}>Add to Sheets</a></li>
          </ul>
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
          <div ref={el => this.el = el} id="mytable">
          </div>
        </div>
        </div>
      );
  }

  render() {
    console.log(this.state.title);
    console.log(this.state.grid);


    return (
      <div>
        {this.renderView()}
      </div>
    );
  }
}
