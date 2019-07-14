import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./Upload.css";
import defaultImage from "../default-image.jpg";
import listReactFiles from 'list-react-files';

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      filenames: [],
      upload: false,
      src: [],
      images: [],
      width: 0,
      height: window.innerHeight / 1.4,
      completedUploads: []
    };
  }

  componentDidMount = () => {
    window.addEventListener("resize", () => {
      this.setState({ height: window.innerHeight, width: window.innerWidth });
    });
  };

  componentWillUnmount = () => {
    //window.removeEventListener(
    //  "resize"
    //);
  };

  submitFile = e => {
    const { files } = this.state;
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file[]", files[i]);
    }
    fetch("/upload-media", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleFileUpload = e => {
    console.log(e.target.files);
    listReactFiles(e.target.files[0].name).then(files => console.log(files));
    let { files } = this.state;
    let { filenames } = this.state;
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i]);
      let filename = e.target.files[i].name;
      let sub = filename.substring(0, filename.indexOf("."));
      filenames.push(sub);
    }
    this.setState({ files: files, filenames: filenames });
  };

  appendMedia = e => {
    const { files, filenames, images } = this.state;

    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      formData.append("songs", files[i]);
      formData.append("names", filenames[i]);
      formData.append("images", images[i]);
      this.postMedia(formData, i);
    }
    e.preventDefault();
  };

  postMedia = (formData, i) => {
    fetch("/post-media", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.success === true) {
          let { filenames, files, images, src, completedUploads } = this.state;
          completedUploads.push(res.song);
          filenames.splice(i, 1);
          files.splice(i, 1);
          images.splice(i, 1);
          src.splice(i, 1);
          this.setState({
            files: files,
            filenames: filenames,
            images: images,
            src: src,
            completedUploads: completedUploads
          });
        }
      })
      .catch(err => {});
  };

  handleImageUpload = (e, i) => {
    
 

    e.persist();
    let { src, images, files } = this.state;
    const index = this.file.name;
    e.persist();
    src[index] = window.URL.createObjectURL(e.target.files[0]);
    images[index] = e.target.files[0];
    this.setState({
      src: src,
      images: images
    });
  };

  changeFilename = (e, index) => {
    let { filenames } = this.state;
    filenames[index] = e.target.value;
    this.setState({ filenames: filenames });
  };

  cancelUpload = (e, file) => {
    e.persist();
    e.preventDefault();
    const index = e.target.name;
    let { files, filenames, src, images } = this.state;
    files.splice(index, 1);
    filenames.splice(index, 1);
    src.splice(index, 1);
    images.splice(index, 1);

    this.setState({
      files: files,
      filenames: filenames,
      src: src,
      images: images
    });
  };

  dropHandler = (e) => {
    e.preventDefault();
    e.persist();
    console.log(e.dataTransfer.files);
    e.target = e.dataTransfer;
    this.handleFileUpload(e);

  }

  dragOverHandler = (e) => {
    e.preventDefault();
  }

  handleSubmit = event => {
    event.preventDefault();
    alert(`Selected file - ${this.fileInput.current.files[0].name}`);
  };

  render() {
    console.log(this.state.completedUploads);
    let { filenames } = this.state;
    return (
      <div id="drop_zone" onDrop={this.dropHandler} onDragOver={this.dragOverHandler}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>
              <br />
              <div className="musicUpload">
                <label className="upload">
                  <input
                    type="file"
                    id="upload"
                    name="file"
                    label="upload file"
                    onChange={this.handleFileUpload}
                    
                    webkitdirectory="true" mozdirectory="true"
                  />
                  Add Song (+)
                </label>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{}}>
            {this.state.files.map((file, i) => {
              return (
                <div key={i} className="uploadMenu">
                  <div className="image-upload">
                    <Button
                      name={i}
                      variant="alert"
                      onClick={(e, file) => this.cancelUpload(e, file)}
                    >
                      X
                    </Button>
                    <label htmlFor="file-input">
                      <img
                        id="blah"
                        alt="image"
                        width="100"
                        height="100"
                        src={this.state.src[i] || defaultImage}
                      />
                    </label>
                    <input
                      ref={e => (this.file = e)}
                      name={i}
                      type="file"
                      id="file-input"
                      onChange={(e, i) => this.handleImageUpload(e, i)}
                    />
                  </div>
                  <div>
                    <p>
                      <b>File:</b> {file.name}
                    </p>
                  </div>
                  <div id="uploadFileForm">
                    <p>
                      <b>Name: </b>
                    </p>
                    <input
                      id="filename"
                      type="text"
                      value={filenames[i]}
                      name="title"
                      placeholder="Song Name"
                      onChange={e => {
                        this.changeFilename(e, i);
                      }}
                    />
                  </div>
                  <hr />
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" onClick={this.appendMedia}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }
}
export default Upload;
