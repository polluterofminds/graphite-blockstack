import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
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
    myMessages: [],
    filteredValue: [],
    tempDocId: "",
    redirect: false,
    loading: "",
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
  this.setState({receiver: loadUserData().username})
  let info = loadUserData().profile;
  if(info) {
    this.setState({ userImg: info.image[0].contentUrl})
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
     // .then(() => {
     //   // this.fetchData();
     //   const fileName = this.state.conversationUser.slice(0, -3) + '.json';
     //   getFile(fileName, {decrypt: true})
     //    .then((fileContents) => {
     //      if(fileContents) {
     //        console.log("Messages are here");
     //        this.setState({ messages: JSON.parse(fileContents || '{}').messages });
     //        console.log(this.state.messages);
     //      } else {
     //        console.log("No saved files");
     //      }
     //    })
     //     .catch(error => {
     //       console.log(error);
     //     });
     // })
      .catch(error => {
        console.log(error);
      });


    this.refresh = setInterval(() => this.fetchMine(), 1000);
    this.refresh = setInterval(() => this.fetchData(), 1000);
}

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

  lookupProfile(username)
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

handleMessage(e) {
  this.setState({ newMessage: e.target.value })
}


render() {
  let myMessages = this.state.myMessages;
  let sharedMessages = this.state.sharedMessages;
  console.log(this.state.sharedMessages);
  const userData = blockstack.loadUserData();
  const person = new blockstack.Person(userData.profile);


  return (
    <div>
    <div className="navbar-fixed toolbar">
      <nav className="toolbar-nav">
        <div className="nav-wrapper">
          <a href="/documents" className="brand-logo">Graphite.<img className="pencil" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Black_pencil.svg/1000px-Black_pencil.svg.png" alt="pencil" /></a>

          <ul id="nav-mobile" className="right">
          <ul id="dropdown1" className="dropdown-content">
            <li><a href="/profile">Profile</a></li>
            <li><a href="/shared-docs">Shared Files</a></li>
            <li><a href="/export">Export All Data</a></li>
            <li className="divider"></li>
            <li><a onClick={ this.handleSignOut }>Sign out</a></li>
          </ul>
          <ul id="dropdown2" className="dropdown-content">
            <li><a href="/documents"><i className="material-icons blue-text text-darken-2">description</i><br />Documents</a></li>
            <li><a href="/sheets"><i className="material-icons green-text text-lighten-1">grid_on</i><br />Sheets</a></li>
          </ul>
            <li><a className="dropdown-button" href="#!" data-activates="dropdown2"><i className="material-icons apps">apps</i></a></li>
            <li><a className="dropdown-button" href="#!" data-activates="dropdown1"><img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" /><i className="material-icons right">arrow_drop_down</i></a></li>
          </ul>
        </div>
      </nav>
      </div>
      <div className="messages row">
        <h3>Conversation with {this.state.conversationUser}</h3>
        <div className="message col s6">
        {sharedMessages.map(message => {
          if(message.sender == loadUserData().username || message.receiver == loadUserData().username){
            return (
              <div key={message.id} className="">

                <div className="bubble receiver container row">
                  <div className="col s4">
                    <img className="responsive-img receiver-message-img circle" src={this.state.conversationUserImage} alt="avatar" />
                  </div>
                  <div className="col s8">
                    <p>{message.content}</p>
                    <p>{message.created}</p>
                  </div>
                </div>
              </div>
            )
          }else {
            return (
              <div></div>
            )
          }
          })
        }
        </div>
        <div className="message col s6">
        {myMessages.map(message => {
          if(message.sender == this.state.conversationUser || message.receiver == this.state.conversationUser){
            return (
              <div key={message.id} className="right-side">

                  <div className="bubble sender container row">
                    <div className="col s8">
                      <p>{message.content}</p>
                      <p>{message.created}</p>
                    </div>
                    <div className="col s4">
                      <img className="responsive-img sender-message-img circle" src={this.state.userImg} alt="avatar" />
                    </div>
                  </div>
              </div>
            )
          }else {
            return (
              <div></div>
            )
          }
          })
        }
        </div>
      </div>
      <div className="center-align container white">
        <input type="text" placeholder="Message here" value={this.state.newMessage} onChange={this.handleMessage} />
        <button onClick={this.handleaddItem} className="btn">Send</button>
      </div>

    </div>
  );
}
}
