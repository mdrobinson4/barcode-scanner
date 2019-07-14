import React, { Component } from 'react';
import axios from 'axios';

class UploadForm extends Component {
  constructor () {
    super();
    this.state = {

    };
  }

  render () {
    return (
      <div>
        {
          this.props.forms.map(file => {
            return (
              <TextInput name={file.name} placeholder={"enter song name"} value
              <input type="text" name="name" placeholder="enter song name" />

            )
          })
        }
      </div>
    );
  }
}

export default UploadForm;
