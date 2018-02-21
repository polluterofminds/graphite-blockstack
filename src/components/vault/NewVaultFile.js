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

export default class NewVaultFile extends Component {
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
  	};
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.save = this.save.bind(this);
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

  handleDrop(files) {
   var file = files[0]
   const reader = new FileReader();
   reader.onload = (event) => {
      const object = {};
      object.file = file;
      object.link = event.target.result;
      object.name = file.name;
      object.size = file.size;
      object.type = file.type;
      object.lastModified = file.lastModified;
      object.lastModifiedDate = file.lastModifiedDate;
      object.id = Date.now();
      if(object.size > 1048576) {
        this.handleDropRejected();
      }else {
        this.setState({files: [...this.state.files, object]});
        setTimeout(this.save, 700)
      }

      // console.log(event.target.result);
      // console.log(object);
   };
   reader.readAsDataURL(file);
   // this.setState({ files: [...this.state.files, object]})
 }

 handleDropRejected(files) {
  console.log("Error file too large");
  Materialize.toast('Sorry, your file is larger than 1mb', 4000) // 4000 is the duration of the toast
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

  render() {
    const dropzoneStyle = {
      width  : "100%",
      height : "400px",

      marginTop: "74px",
      background: "#eb6a5a",
      paddingTop: "10%",
      cursor: "pointer"
    };
    let key = Date.now();
    let files = this.state.files;
    // files.slice(0).reverse().map(file => {
    //   return(console.log(file.name))
    // });
    console.log(files);
    const { handleSignOut } = this.props;
    const { person } = this.state;
    return (
      !isSignInPending() ?
      <div className="center-align container">
      <h1>Upload a new file</h1>
      <h3>File size limit: 1mb</h3>
      <div className="card hoverable">
        <Dropzone
          style={dropzoneStyle}
          onDrop={ this.handleDrop }
          accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,video/quicktime, video/x-ms-wmv,video/mp4,application/pdf,image/jpeg,image/jpg,image/tiff,image/gif"
          multiple={ false }
          onDropRejected={ this.handleDropRejected }>
          <h1 className="upload-cloud"><i className="material-icons white-text large">cloud_upload</i></h1>
          <h3 className="white-text">Drag files or click to upload</h3>
        </Dropzone>

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
