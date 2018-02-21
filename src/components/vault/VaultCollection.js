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

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class VaultCollection extends Component {
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
      folders: [],
  	};
  }

  componentDidMount() {
  getFile("files.json", {decrypt: true})
   .then((fileContents) => {
     this.setState({ files: JSON.parse(fileContents || '{}') });
   })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    let files = this.state.files;
    let folders = this.state.folders;

    console.log(files);
    const { handleSignOut } = this.props;
    const { person } = this.state;
    return (
      !isSignInPending() ?
      <div className="docs">
        <h3 className="center-align">Your Files</h3>
        <div className="row">
          <div className="col s4 m2">
            <div className="card-panel grey">
              <span className="white-text center-align">
                <p><i className="medium material-icons">create_new_folder</i></p>
                <p>Create a folder</p>
              </span>
            </div>
          </div>
          {folders.slice(0).reverse().map(folder => {
            return (
              <div className="col s4 m2">
                <div className="card-panel grey">
                  <span className="white-text center-align">
                    <p>{folder.name}</p>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="row">
          <div className="col s6 m3">
          <div className="card small">
            <Link to={'/vault/new'}><div className="center-align card-content">
              <p><i className="addDoc large material-icons">add</i></p>
            </div></Link>
            <Link to={'/new-file'}><div className="card-action">
              <a className="black-text">Upload File</a>
            </div></Link>
          </div>
          </div>

          {files.slice(0).reverse().map(file => {
              return(

              <Link key={file.id} to={'/files/' + file.id}><div className="col s6 m3">

                  <div className="card small renderedDocs">
                  <a className="black-text">
                    <div className="center-align card-content">
                      {
                        file.type.includes("image") ? <p><i className="vault large material-icons">photo</i></p> :
                        file.type.includes("pdf") ? <p><i className="vault large material-icons">picture_as_pdf</i></p> :
                        file.type.includes("word") ? <img className="icon-image" src="https://image.flaticon.com/icons/svg/732/732078.svg" alt="word document" /> :
                        file.type.includes("video") ? <p><i className="vault large material-icons">video_library</i></p> :
                        file.type.includes("spreadsheet") ? <img className="icon-image" src="https://image.flaticon.com/icons/svg/1/1396.svg" alt="excel file" /> :
                        <div />
                      }
                    </div>
                    </a>
                    <div className="card-action">
                      <a href="#"><a className="black-text">{file.name}</a></a>
                      <Link to={'/files/delete/' + file.id}>

                          <i className="modal-trigger material-icons red-text delete-button">delete</i>

                      </Link>
                      <div className="muted">
                        <p>{file.lastModifiedDate}</p>
                      </div>
                    </div>
                  </div>
                </div></Link>
              )
              })
            }

        </div>
      </div> : null
    );
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
    });
  }
}
