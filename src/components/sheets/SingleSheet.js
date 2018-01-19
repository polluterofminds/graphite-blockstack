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
import update from 'immutability-helper';

export default class SingleSheet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sheets: [],
      grid: [
        [],
      ],
      title: "",
      index: "",
      save: "",
      loading: "hide",
      printPreview: false,
      autoSave: "Saved",
      receiverID: "",
      shareModal: "hide",
      shareFile: "",
      initialLoad: "",
      show: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.autoSave = this.autoSave.bind(this);
    this.shareModal = this.shareModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.shareDoc = this.shareDoc.bind(this);
    this.sharedInfo = this.sharedInfo.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleIDChange = this.handleIDChange.bind(this);
  }
  componentDidMount() {
    getFile("spread.json", {decrypt: true})
     .then((fileContents) => {
        this.setState({ sheets: JSON.parse(fileContents || '{}').sheets })
        console.log("loaded");
        this.setState({ initialLoad: "hide" });
     }).then(() =>{
       let sheets = this.state.sheets;
       const thisSheet = sheets.find((sheet) => { return sheet.id == this.props.match.params.id});
       let index = thisSheet && thisSheet.id;
       console.log(index);
       function findObjectIndex(sheet) {
           return sheet.id == index;
       }
       this.setState({ grid: thisSheet && thisSheet.grid || this.state.grid, title: thisSheet && thisSheet.title, index: sheets.findIndex(findObjectIndex) })
     })
     .finally(() => {
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
      this.printPreview = () => {
        if(this.state.printPreview == true) {
          this.setState({printPreview: false});
        } else {
          this.setState({printPreview: true});
        }
      }
      this.download = () => {
        this.$el.jexcel('download');
      }
      setTimeout(this.handleAddItem,1000);
      this.refresh = setInterval(() => this.handleAddItem(), 3000);
    }

    componentWillUnmount() {
      // this.$el.jexcel({ data: data, colWidths: [ 300, 80, 100 ] })('destroy');
    }
    handleAddItem() {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const object = {};
      object.title = this.state.title;
      object.grid = this.state.grid;
      object.id = parseInt(this.props.match.params.id);
      object.updated = month + "/" + day + "/" + year;
      const index = this.state.index;
      const updatedSheet = update(this.state.sheets, {$splice: [[index, 1, object]]});  // array.splice(start, deleteCount, item1)
      this.setState({sheets: updatedSheet});
      this.autoSave();
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

handleIDChange(e) {
    this.setState({ receiverID: e.target.value })
  }

autoSave() {
  this.setState({autoSave: "Saving..."});
  putFile("spread.json", JSON.stringify(this.state), {encrypt: true})
    .then(() => {
      console.log("Autosaved");
      this.setState({autoSave: "Saved"});
    })
    .catch(e => {
      console.log("e");
      console.log(e);
      alert(e.message);
    });
}

shareModal() {
  this.setState({
    shareModal: ""
  });
}

sharedInfo(){
  this.setState({ loading: "", show: "hide" });
  const object = {};
  object.title = this.state.title || "Untitled";
  object.content = this.state.grid;
  object.id = Date.now();
  object.receiverID = this.state.receiverID;
  this.setState({ shareFile: object });
  setTimeout(this.shareDoc, 700);
}

hideModal() {
  this.setState({
    shareModal: "hide"
  });
}

shareDoc() {
  const fileName = 'sharedsheet.json'
  putFile(fileName, JSON.stringify(this.state.shareFile), true)
    .then(() => {
      console.log("Shared!");
      this.setState({ shareModal: "hide", loading: "hide", show: "" });
      Materialize.toast('Sheet shared with ' + this.state.receiverID, 4000);
    })
    .catch(e => {
      console.log("e");
      console.log(e);
      alert(e.message);
    });

}

print(){
  const curURL = window.location.href;
  history.replaceState(history.state, '', '/');
  window.print();
  history.replaceState(history.state, '', curURL);
}



renderView() {

  const loading = this.state.loading;
  const save = this.state.save;
  const autoSave = this.state.autoSave;
  const shareModal = this.state.shareModal;
  const show = this.state.show;
  const initialLoad = this.state.initialLoad;
  console.log(this.state.sheets);

  if(this.state.initialLoad === "") {
    return (
      <div className="center-align sheets-loader">
      <div className="navbar-fixed toolbar">
        <nav className="toolbar-nav">
          <div className="nav-wrapper">
            <a href="/sheets" className="brand-logo"><i className="material-icons">arrow_back</i></a>


              <ul className="left toolbar-menu">
                <li><input className="black-text" type="text" placeholder="Sheet Title" value={this.state.title} onChange={this.handleTitleChange} /></li>
                <li><a onClick={this.print}><i className="material-icons">local_printshop</i></a></li>
                <li><a ref={el => this.el = el} onClick={this.download}><img className="csvlogo" src="https://d30y9cdsu7xlg0.cloudfront.net/png/605579-200.png" /></a></li>
                <li><a onClick={this.shareModal}><i className="material-icons">share</i></a></li>
              </ul>
              <ul className="right toolbar-menu auto-save">
              <li><a className="muted">{autoSave}</a></li>
              </ul>

          </div>
        </nav>
      </div>
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
                <li><a onClick={this.print}><i className="material-icons">local_printshop</i></a></li>
                <li><a ref={el => this.el = el} onClick={this.download}><img className="csvlogo" src="https://d30y9cdsu7xlg0.cloudfront.net/png/605579-200.png" /></a></li>
                <li><a onClick={this.shareModal}><i className="material-icons">share</i></a></li>
              </ul>
              <ul className="right toolbar-menu auto-save">
              <li><a className="muted">{autoSave}</a></li>
              </ul>

          </div>
        </nav>
      </div>
      <div className={shareModal}>
        <div className="container">
          <div className="card share grey white-text center-align">
            <h6>Enter the Blockstack user ID of the person to share with</h6>
            <input className="share-input white grey-text" placeholder="Ex: JohnnyCash.id" type="text" onChange={this.handleIDChange} />
            <div className={show}>
            <button onClick={this.sharedInfo} className="btn white black-text">Share</button>
            <button onClick={this.hideModal} className="btn">Cancel</button>
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

    return (
      <div>
      {this.renderView()}
      </div>
    )
  }
}
