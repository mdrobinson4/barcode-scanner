import React, { Component } from 'react';
import axios from 'axios';

class Upload extends Component {
  constructor () {
    super();
    this.state = {
      files: []
    };
  }

  submitFile = (e) => {
    const { files } = this.state;
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file[]', files[i]);
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
  }

  handleFileUpload = (e) => {
    let { files } = this.state;
    files.push(e.target.files[0]);
    this.setState( { files: files } );
  }

  render () {
    console.log(this.state.files);
    return (
      <div>
      <form onSubmit={this.submitFile}>
        <input label='upload file' name="file" type='file' onChange={this.handleFileUpload} multiple/>
        <button type='submit'>Send</button>
      </form>
      <form>
      {
        this.state.files.map(file => {
          return (
            <TextInput
              valu
            />
          )
        })
      }
      </form>
      </div>
    );
  }
}

export default Upload;
