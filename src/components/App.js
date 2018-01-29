import React, { Component, Link } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Profile from './Profile';
import Signin from './Signin';
import Header from './Header';
import AppPage from './AppPage';
import Main from './documents/Main';
import Doc from './documents/Document';
import TestDoc from './documents/TestDoc';
import SingleDoc from './documents/SingleDoc';
import DeleteDoc from './documents/DeleteDoc';
import SharedCollection from './documents/SharedCollection';
import SingleSharedDoc from './documents/SingleSharedDoc';
import Admin from './documents/Admin';
import SharedDocs from './documents/SharedDocs';
import SharedSheets from './sheets/SharedSheets';
import MainSheets from './sheets/MainSheets';
import SingleSheet from './sheets/SingleSheet';
import TestSheet from './sheets/TestSheet';
import DeleteSheet from './sheets/DeleteSheet';
import MainContacts from './messages/MainContacts';
import Contacts from './messages/Contacts';
import Conversations from './messages/Conversations';
import ContactsProfile from './messages/ContactsProfile';
import SingleConversation from './messages/SingleConversation';
import DeleteContact from './messages/DeleteContact';
import Export from './Export';
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
} from 'blockstack';

export default class App extends Component {

  constructor(props) {
  	super(props);
  }

  handleSignIn(e) {
    e.preventDefault();
    redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {
    return (
      <div>
      <BrowserRouter>
          <div className="main-container">
            <Header handleSignOut={ this.handleSignOut } handleSignIn={ this.handleSignIn } />
            <Route exact path="/" component={AppPage} />
            <Route exact path="/documents" component={Main} />
            <Route exact path="/test" component={TestDoc} />
            <Route exact path="/documents/doc/new" component={Doc} />
            <Route exact path="/documents/doc/:id" component={SingleDoc} />
            <Route exact path="/documents/doc/delete/:id" component={DeleteDoc} />
            <Route exact path="/documents/shared/:id" component={SharedCollection} />
            <Route exact path="/documents/single/shared/:id" component={SingleSharedDoc} />
            <Route exact path="/admin-docs" component={Admin} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/shared-docs" component={SharedDocs} />
            <Route exact path="/sheets" component={MainSheets} />
            <Route exact path="/sheets/sheet/:id" component={SingleSheet} />
            <Route exact path="/sheets/sheet/delete/:id" component={DeleteSheet} />
            <Route exact path="/testsheet" component={TestSheet} />
            <Route exact path="/shared-sheets" component={SharedSheets} />
            <Route exact path="/export" component={Export} />
            <Route exact path="/contacts" component={MainContacts} />
            <Route exact path="/conversations" component={Conversations} />
            <Route exact path="/contacts/profile/:id" component={ContactsProfile} />
            <Route exact path="/contacts/conversations/:id" component={SingleConversation} />
            <Route exact path="/contacts/delete/:id" component={DeleteContact} />
          </div>
        </BrowserRouter>
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
