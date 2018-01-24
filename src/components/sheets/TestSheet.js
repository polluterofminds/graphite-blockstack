import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile
} from 'blockstack';

export default class TestSheet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sheets: [],
      grid: [
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],
        ['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],['', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', ''],

      ],
      title: "",
      save: "",
      loading: "hide",
      printPreview: false,
      autoSave: "Saved",
      receiverID: "",
      shareModal: "hide",
      shareFile: "",
      initialLoad: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.shareModal = this.shareModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.shareDoc = this.shareDoc.bind(this);
    this.sharedInfo = this.sharedInfo.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }
  componentDidMount() {
    getFile('jexcel.json', {decrypt: true})
      .then((file) => {
        const sheet = JSON.parse(file || '[]')
        this.setState({
          grid: sheet
        })
        console.log("Loaded");
        this.setState({ initialLoad: "hide" });
      })
      .then(() => {
        this.$el = $(this.el);
        this.$el.jexcel({
          data: this.state.grid,
          onchange: this.handleChange,
          colWidths: [150, 150, 150, 150, 150],
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
      this.printPreview = () => {
        if(this.state.printPreview == true) {
          this.setState({printPreview: false});
        } else {
          this.setState({printPreview: true});
        }
      }
    }

    componentWillUnmount() {
      // this.$el.jexcel({ data: data, colWidths: [ 300, 80, 100 ] })('destroy');
    }
    handleAddItem() {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const rando = Date.now();
      const object = {};
      object.title = this.state.title;
      object.grid = this.state.grid;
      object.id = rando;
      object.created = month + "/" + day + "/" + year;

      this.setState({ sheets: [...this.state.sheets, object] });
      console.log(this.state.sheets);
      // this.setState({ filteredValue: [...this.state.filteredValue, object] });
      // this.setState({ tempDocId: object.id });
      // this.setState({ confirm: true, cancel: false });
      // setTimeout(this.saveFile, 500);
      // setTimeout(this.handleGo, 700);
    }

    handleTitleChange(e) {
      this.setState({
        title: e.target.value
      });
    }

handleChange(instance, cell, value) {
    var cellName = $(instance).jexcel('getColumnNameFromId', $(cell).prop('id'));
    console.log('New change on cell ' + cellName + ' to: ' + value + '<br>');
    console.log(this.state.grid);
}

saveFile() {
  putFile('jexcel.json', JSON.stringify(this.state), {encrypt: true})
  .then(() => {
    console.log("Success!");
  })
}

shareModal() {
  this.setState({
    shareModal: ""
  });
}

sharedInfo(){
  this.setState({ loading: "", show: "hide" });
  const object = {};
  object.title = this.state.textvalue || "Untitled";
  object.content = this.state.test;
  object.id = Date.now();
  object.receiverID = this.state.receiverID;
  object.words = wordcount(this.state.test);
  this.setState({ shareFile: object });
  setTimeout(this.shareDoc, 700);
}

hideModal() {
  this.setState({
    shareModal: "hide"
  });
}

shareDoc() {
  const fileName = 'shared.json'
  putFile(fileName, JSON.stringify(this.state.shareFile), true)
    .then(() => {
      console.log("Shared!");
      this.setState({ shareModal: "hide", loading: "hide", show: "" });
      Materialize.toast('Document shared with ' + this.state.receiverID, 4000);
    })
    .catch(e => {
      console.log("e");
      console.log(e);
      alert(e.message);
    });

}

renderView() {
  const loading = this.state.loading;
  const save = this.state.save;
  const autoSave = this.state.autoSave;
  const shareModal = this.state.shareModal;
  const show = this.state.show;
  const initialLoad = this.state.initialLoad;
  console.log(this.state.initialLoad);

  if(this.state.initialLoad === "") {
    return (
      <div className="center-align sheets-loader">
      <div className={initialLoad}>
        <div className="preloader-wrapper big active">
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
    );
  } else {
    return (
      <div>
      <div className="navbar-fixed toolbar">
        <nav className="toolbar-nav">
          <div className="nav-wrapper">
            <a href="/sheets" className="brand-logo"><i className="material-icons">arrow_back</i></a>


              <ul className="left toolbar-menu">
                <li><input className="black-text" type="text" placeholder="Sheet Title" value={this.state.title} onChange={this.handleTitleChange} /></li>
                <li><a ><i className="material-icons">local_printshop</i></a></li>
                <li><a ><img className="wordlogo" src="https://d30y9cdsu7xlg0.cloudfront.net/png/605579-200.png" /></a></li>
                <li><a><i className="material-icons">share</i></a></li>
              </ul>
              <ul className="right toolbar-menu auto-save">
              <li><a className="muted">Saved</a></li>
              </ul>

          </div>
        </nav>
      </div>
      <div className={shareModal}>
        <div className="container">
          <div className="card share grey white-text center-align">
            <h6>Enter the Blockstack user ID of the person to share with</h6>
            <input className="white grey-text" placeholder="Ex: JohnnyCash.id" type="text" onChange={this.handleIDChange} />
            <div className={show}>
              <button className="btn white black-text">Share</button>
              <button className="btn">Cancel</button>
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
      </div>
        <div>
          <div>
            <div>
              <div ref={el => this.el = el} id="mytable">
              </div>
            </div>
          </div>
        </div>
        </div>
    );
  }
}

  render () {
    console.log(this.state.title);
    return (
      <div>
      <button onClick={this.handleAddItem}>Save it</button>
      {this.renderView()}
      </div>
    )
  }
}
