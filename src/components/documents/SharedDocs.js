import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Profile from '../Profile';
import Signin from '../Signin';
import Header from '../Header';
import Collections from './Collections';
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
const Quill = ReactQuill.Quill;
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['Ubuntu', 'Raleway', 'Roboto', 'Lato', 'Open Sans', 'Montserrat'] ; // allow ONLY these fonts and the default
ReactQuill.Quill.register(Font, true);

export default class SharedDocs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      username: "",
      contacts: [],
      filteredContacts: [],
      title : "",
      content:"",
      updated: "",
      words: "",
      index: "",
      save: "",
      loading: "hide",
      printPreview: false,
      autoSave: "Saved",
      value: [],
      filteredValue: [],
      tempDocId: "",
      redirect: false,
      loading: "hide",
      receiverID: "",
      senderID: "",
      show: "",
      hide: "",
      hideButton: ""
    }

    this.fetchData = this.fetchData.bind(this);
    this.handleIDChange = this.handleIDChange.bind(this);
    this.pullData = this.pullData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleaddItem = this.handleaddItem.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
  }

  componentDidMount() {
    getFile("contact.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Contacts are here");
         this.setState({ contacts: JSON.parse(fileContents || '{}').contacts });
         this.setState({ filteredContacts: this.state.contacts });
       } else {
         console.log("No contacts");
       }
     })
      .catch(error => {
        console.log(error);
      });

    getFile("documents.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         this.setState({ value: JSON.parse(fileContents || '{}').value });
         this.setState({filteredValue: this.state.value})
         // this.setState({ loading: "hide" });
       } else {
         console.log("Nothing to see here");
         // this.setState({ value: {} });
         // this.setState({ filteredValue: {} })
         // console.log(this.state.value);
         // this.setState({ loading: "hide" });
       }
     })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
    });
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
    object.content = this.state.content;
    object.id = rando;
    object.created = month + "/" + day + "/" + year;

    this.setState({ value: [...this.state.value, object] });
    this.setState({ filteredValue: [...this.state.filteredValue, object] });
    this.setState({ tempDocId: object.id });
    this.setState({ loading: "" });
    // this.setState({ confirm: true, cancel: false });
    setTimeout(this.saveNewFile, 500);
    // setTimeout(this.handleGo, 700);
  }

  saveNewFile() {
    putFile("documents.json", JSON.stringify(this.state), {encrypt:true})
      .then(() => {
        console.log("Saved!");
        window.location.replace("/documents");
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
  }

  fetchData() {
    const username = this.state.senderID;

      lookupProfile(username, "https://core.blockstack.org/v1/names")
        .then((profile) => {
          this.setState({
            person: new Person(profile),
            username: username
          })
        })
        .catch((error) => {
          console.log('could not resolve profile')
          this.setState({ loading: "hide" });
          Materialize.toast('Could not find user', 2000);
          setTimeout(this.windowRefresh, 2000);
        })

      const options = { username: this.state.senderID, zoneFileLookupURL: "https://core.blockstack.org/v1/names"}

      getFile('shared.json', options)
        .then((file) => {
          const doc = JSON.parse(file || '{}');
          console.log(doc.title);
          this.setState({ title: doc.title, content: doc.content, receiverID: doc.receiverID })
          this.setState({ show: "hide", loading: "hide", hideButton: ""});
        })
        .then(() => {
          this.setState({ isLoading: false })
        })
        .catch((error) => {
          console.log('could not fetch');
          this.setState({ loading: "hide" });
          Materialize.toast('Nothing shared', 2000);
          setTimeout(this.windowRefresh, 2000);
        })
    }

  windowRefresh() {
    window.location.reload(true);
  }


  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  handleIDChange(e) {
    this.setState({ senderID: e.target.value })
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  handleChange(value) {
    this.setState({ content: value })
  }

  pullData() {

    <Redirect push to={fullLink} />
  }

  renderView() {
    SharedDocs.modules = {
      toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': Font.whitelist }],,
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'},
         {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      }
    }
    /*
     * Quill editor formats
     * See https://quilljs.com/docs/formats/
     */
    SharedDocs.formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image', 'video'
    ]

    const words = wordcount(this.state.content);
    const loading = this.state.loading;
    const save = this.state.save;
    const hide = this.state.hide;
    const autoSave = this.state.autoSave;
    const shareModal = this.state.shareModal;
    const hideButton = this.state.hideButton;
    var content = "<p style='text-align: center;'>" + this.state.textvalue + "</p>" + "<div style='text-indent: 30px;'>" + this.state.test + "</div>";

    var htmlString = $('<html xmlns:office="urn:schemas-microsoft-com:office:office" xmlns:word="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">').html('<body>' +

    content +

    '</body>'

    ).get().outerHTML;

    var htmlDocument = '<html xmlns:office="urn:schemas-microsoft-com:office:office" xmlns:word="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><xml><word:WordDocument><word:View>Print</word:View><word:Zoom>90</word:Zoom><word:DoNotOptimizeForBrowser/></word:WordDocument></xml></head><body>' + content + '</body></html>';
    var dataUri = 'data:text/html,' + encodeURIComponent(htmlDocument);


  //   if(this.state.receiverID == loadUserData().username) {
  //     return(
  //       <div>
  //       <div className="navbar-fixed toolbar">
  //         <nav className="toolbar-nav">
  //           <div className="nav-wrapper">
  //             <a href="/documents" className="brand-logo"><i className="material-icons">arrow_back</i></a>
  //
  //           </div>
  //         </nav>
  //       </div>
  //       <div className="container docs">
  //         <div className={hideButton}>
  //           <button onClick={this.handleaddItem} className="btn black center-align">Add to Your Documents</button>
  //         </div>
  //         <div className={loading}>
  //           <div className="preloader-wrapper small active">
  //               <div className="spinner-layer spinner-green-only">
  //                 <div className="circle-clipper left">
  //                   <div className="circle"></div>
  //                 </div><div className="gap-patch">
  //                   <div className="circle"></div>
  //                 </div><div className="circle-clipper right">
  //                   <div className="circle"></div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //
  //         <div className="card doc-card">
  //           <div className="double-space doc-margin">
  //             <p className="center-align print-view">
  //             {this.state.title}
  //             </p>
  //             <div>
  //               <div
  //                 className="print-view no-edit"
  //                 dangerouslySetInnerHTML={{ __html: this.state.content }}
  //               />
  //             </div>
  //             </div>
  //             </div>
  //       </div>
  //
  //       </div>
  //     );
  //   } else {
  //     return(
  //       <div>
  //         <div className="navbar-fixed toolbar">
  //           <nav className="toolbar-nav">
  //             <div className="nav-wrapper">
  //               <a href="/documents" className="brand-logo"><i className="material-icons">arrow_back</i></a>
  //
  //             </div>
  //           </nav>
  //         </div>
  //           <h4 className="center-align">Nothing shared</h4>
  //       </div>
  //     );
  //   }
  //
  }


  render() {
    const show = this.state.show;
    const hideButton = this.state.hideButton;
    let value = this.state.value;
    console.log(loadUserData().username);
    const loading = this.state.loading;
    let contacts = this.state.filteredContacts;
    let link = '/documents/shared/';
    let user = this.state.senderID;
    let fullLink = link + user;

    return (
      <div>
      <div className={show}>
        <div className="container">
          <h3 className="center-align">Shared Documents</h3>
          <div className="card center-align shared">
            <h6>Enter the Blockstack user ID of the person who shared the file with you</h6>
            <input className="" placeholder="Ex: JohnnyCash.id" type="text" onChange={this.handleIDChange} />
            <div className={hideButton}>
              <Link to={fullLink}><button className="btn black">Find File</button></Link>
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
        <h5 className="center-align">Or select from your contacts</h5>
        <div className="shared-contacts row">
        {contacts.slice(0).reverse().map(contact => {
            return (
              <div key={contact.contact} className="col s6 m3">

                <div className="card small renderedDocs">
                <Link to={'/documents/shared/'+ contact.contact} className="black-text">
                  <div className="center-align card-content">
                    <p><img className="responsive-img circle profile-img" src={contact.img} alt="profile" /></p>
                  </div>
                </Link>
                  <div className="card-action">

                    <Link to={'/documents/shared/'+ contact.contact}><a className="black-text">{contact.contact}</a></Link>
                  </div>
                </div>
              </div>
            )
          })
        }
        </div>
      </div>
      </div>
    );
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
