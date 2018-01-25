import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Profile from "../Profile";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import Signin from "../Signin";
import Header from "../Header";
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile,
  signUserOut
} from 'blockstack';
import update from 'immutability-helper';
const Quill = ReactQuill.Quill;
const blockstack = require("blockstack");
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Conversations extends Component {
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
    contacts: [],
    messages: [],
    sharedMessages: [],
    sharedCount: "",
    myMessages: [],
    combinedMessages: [],
    filteredValue: [],
    tempDocId: "",
    redirect: false,
    loading: "",
    show: "hide",
    newMessage: "",
    receiver: "",
    conversationUser: "",
    conversationUserImage: avatarFallbackImage,
    userImg: avatarFallbackImage
  }
  this.handleaddItem = this.handleaddItem.bind(this);
  this.saveNewFile = this.saveNewFile.bind(this);
  this.handleMessage = this.handleMessage.bind(this);
}

componentWillMount() {
  if (isSignInPending()) {
    handlePendingSignIn().then(userData => {
      window.location = window.location.origin;
    });
  }
}

componentDidMount() {
  this.setState({receiver: loadUserData().username});
  let info = loadUserData().profile;
  if(info.image) {
    this.setState({ userImg: info.image[0].contentUrl});
  } else {
    this.setState({ userImg: avatarFallbackImage});
  }

  getFile("contact.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Contacts are here");
         this.setState({ contacts: JSON.parse(fileContents || '{}').contacts });
         let contact = this.state.contacts;
         const thisContact = contact.find((a) => { return a.contact == this.props.match.params.id});
         this.setState({ conversationUser: thisContact && thisContact.contact});
       } else {
         console.log("No contacts");
       }
     })
      .catch(error => {
        console.log(error);
      });

    this.refresh = setInterval(() => this.fetchMine(), 1000);
    this.refresh = setInterval(() => this.fetchData(), 1000);
    // let combined = [{...this.state.myMessages, ...this.state.sharedMessages}]
    // this.setState({ combined: combined});
}

// componentDidUpdate() {
//   this.scrollToBottom();
// }

fetchMine() {
  const fileName = this.state.conversationUser.slice(0, -3) + '.json';
  //TODO decrypt this bad boy
  getFile(fileName)
   .then((fileContents) => {
     if(fileContents) {
       this.setState({ myMessages: JSON.parse(fileContents || '{}').messages });
       // console.log(this.state.messages);
     } else {
       console.log("No saved files");
     }
   })
    .catch(error => {
      console.log(error);
    });
}

fetchData() {
const username = this.state.conversationUser;

  lookupProfile(username, "https://core.blockstack.org/v1/names")
    .then((profile) => {
      let image = profile.image;
      if(profile.image){
        this.setState({conversationUserImage: image[0].contentUrl})
      }
      this.setState({
        person: new Person(profile),
        username: username
      })
    })
    .catch((error) => {
      console.log('could not resolve profile')
    })
  const options = { username: this.state.conversationUser}
  const fileName = loadUserData().username.slice(0, -3) + '.json';
  getFile(fileName, options)
    .then((file) => {
      console.log("fetched!");
      this.setState({ sharedMessages: JSON.parse(file || '{}').messages });
      this.setState({ sharedCount: this.state.sharedMessages.length });
      this.setState({ combinedMessages: [...this.state.myMessages, ...this.state.sharedMessages] });
      this.setState({ loading: "hide", show: "" });
      this.scrollToBottom();
    })
    .catch((error) => {
      console.log('could not fetch');
    })
}

handleaddItem() {
  const today = new Date();
  const rando = Date.now();
  const object = {};
  object.content = this.state.newMessage;
  object.id = rando;
  object.created = today.toString();
  object.sender = loadUserData().username;
  object.receiver = this.state.conversationUser;

  this.setState({ messages: [...this.state.myMessages, object] });
  this.setState({newMessage: ""});
  setTimeout(this.saveNewFile, 500);
  // setTimeout(this.handleGo, 700);
}

saveNewFile() {
  const fileName = this.state.conversationUser.slice(0, -3) + '.json';
  putFile(fileName, JSON.stringify(this.state))
    .then(() => {
      console.log("Saved!");
    })
    .catch(e => {
      console.log(e);
    });
}

handleSignOut(e) {
  e.preventDefault();
  signUserOut(window.location.origin);
}

handleMessage(value) {
  this.setState({ newMessage: value })
}

scrollToBottom = () => {
  this.messagesEnd.scrollIntoView({ behavior: "smooth" });
}

render() {
  console.log(this.state.sharedMessages.length);
  let combinedMessages = this.state.combinedMessages;
  function compare(a,b) {
    if (a.id < b.id)
      return -1;
    if (a.id > b.id)
      return 1;
    return 0;
  }
  let messages = combinedMessages.sort(compare);


  let myMessages = this.state.myMessages;
  let sharedMessages = this.state.sharedMessages;

  const userData = blockstack.loadUserData();
  const person = new blockstack.Person(userData.profile);
  let loading = this.state.loading;
  let show = this.state.show;

  return (
    <div>
    <div className="navbar-fixed toolbar">
      <nav className="toolbar-nav">
        <div className="nav-wrapper">
          <a href="/contacts" className="brand-logo"><i className="material-icons">arrow_back</i></a>


            <ul className="left toolbar-menu">
              <li><a>Conversation with {this.state.conversationUser}</a></li>
            </ul>

        </div>
      </nav>
    </div>

      <div className="container">
        <div className={loading}>
          <div className="progress center-align">
            <p>Loading...</p>
            <div className="indeterminate"></div>
          </div>
        </div>
      </div>
      <div className={show}>
      <div>
      {messages.map(message => {
        if(message.sender == loadUserData().username || message.receiver == loadUserData().username){
          if(message.sender == loadUserData().username) {
            return (
              <div key={message.id} className="">

                <div className="bubble sender container row">
                  <div className="col s8">
                    <p dangerouslySetInnerHTML={{ __html: message.content }} />
                    <p className="muted">{message.created}</p>
                  </div>
                  <div className="col s4">
                    <img className="responsive-img sender-message-img circle" src={this.state.userImg} alt="avatar" />
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div key={message.id} className="">

                <div className="bubble receiver container row">
                  <div className="col s4">
                    <img className="responsive-img receiver-message-img circle" src={this.state.conversationUserImage} alt="avatar" />
                  </div>
                  <div className="col s8">
                    <p dangerouslySetInnerHTML={{ __html: message.content }} />
                    <p className="muted">{message.created}</p>
                  </div>
                </div>
              </div>
            )
          }
        }else {
          return (
            <div></div>
          )
        }
        })
      }
      </div>
        <div style={{ float:"left", clear: "both" }}
          ref={(el) => { this.messagesEnd = el; }}>
        </div>
      </div>
      <div className="center-align message-input container white">
        <ReactQuill
          id="textarea1"
          className="materialize-textarea print-view"
          placeholder="Send a message"
          theme="bubble"
          value={this.state.newMessage}
          onChange={this.handleMessage} />

        <button onClick={this.handleaddItem} className="btn">Send</button>
      </div>

    </div>
  );
}
}

// <input type="text" placeholder="Message here" value={this.state.newMessage} onChange={this.handleMessage} />
