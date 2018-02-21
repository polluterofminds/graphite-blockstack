import React, { Component } from 'react';
import {
isSignInPending,
loadUserData,
Person,
getFile,
putFile,
lookupProfile,
signUserOut,
} from 'blockstack';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone'
import PDF from 'react-pdf-js';
import { Player } from 'video-react';
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class SingleVaultFile extends Component {
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
      files: [],
      name: "",
      link: "",
      lastModified: "",
      lastModifiedDate: "",
      size: "",
      type: "",
      index: "",
      pages: "",
      page: "",
  	};
    this.save = this.save.bind(this);
    this.onDocumentComplete = this.onDocumentComplete.bind(this);
    this.onPageComplete = this.onPageComplete.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
  getFile("files.json", {decrypt: true})
   .then((fileContents) => {
     this.setState({ files: JSON.parse(fileContents || '{}') });
     let files = this.state.files;
      const thisFile = files.find((file) => { return file.id == this.props.match.params.id});
      let index = thisFile && thisFile.id;
      console.log(index);
      function findObjectIndex(file) {
        return file.id == index;
      }
      this.setState({ name: thisFile && thisFile.name, type: thisFile && thisFile.type, lastModified: thisFile && thisFile.lastModified, lastModifiedDate: thisFile && thisFile.lastModifiedDate, size: thisFile && thisFile.size, link: thisFile && thisFile.link, index: files.findIndex(findObjectIndex) })
   })
    .catch(error => {
      console.log(error);
    });
  }

  onDocumentComplete(pages) {
    this.setState({ page: 1, pages });
  }

  onPageComplete(page) {
    this.setState({ page });
  }

  handlePrevious() {
    this.setState({ page: this.state.page - 1 });
  }

  handleNext() {
    this.setState({ page: this.state.page + 1 });
  }

  save() {
    putFile("files.json", JSON.stringify(this.state.files), {encrypt:true})
      .then(() => {
        console.log("Saved!");
        window.location.replace("/");
      })
      .catch(e => {
        console.log("e");
        console.log(e);
        alert(e.message);
      });
  }

  renderPagination(page, pages) {
    let previousButton = <li className="previous" onClick={this.handlePrevious}><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    if (page === 1) {
      previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    }
    let nextButton = <li className="next" onClick={this.handleNext}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    if (page === pages) {
      nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    }
    return (
      <nav>
        <ul className="pager">
          {previousButton}
          {nextButton}
        </ul>
      </nav>
      );
  }

  render() {
    console.log(this.state.link);
    const type = this.state.type;
    const { handleSignOut } = this.props;
    const { person } = this.state;
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      !isSignInPending() ?
      <div className="center-align container">
        <div>
        {
          type.includes("image") ? <div className="single-file-div"><img className="single-image" src={this.state.link} alt={this.state.name} /><h3>{this.state.name}</h3></div> :
          type.includes("pdf") ?
            <div className="single-file-div">
              <PDF
                file={this.state.link}
                onDocumentComplete={this.onDocumentComplete}
                onPageComplete={this.onPageComplete}
                page={this.state.page}
              />
            {pagination}
            </div> :
          type.includes("officedocument") ? <img className="icon-image" src="https://image.flaticon.com/icons/svg/732/732078.svg" alt="word document" /> :
          type.includes("video") ?
            <div className="single-file-div">
              <Player
                playsInline
                src={this.state.link}
              />
            </div> :
          type.includes("excel") ? <img className="icon-image" src="https://image.flaticon.com/icons/svg/1/1396.svg" alt="excel file" /> :
          <div />
        }

        </div>
      </div>
       : null
    );
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
    });
  }
}
