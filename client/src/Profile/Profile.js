import React, { Component } from "react";
import "./Profile.css";
import io from "socket.io-client";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = { };
  }

  // get a list of the groups
  getGroups = () => {
    fetch("/groups", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => console.log(res));
  }

  // get a specific group and the barcodes
  getGroup = (id) => {
    fetch("/groups", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'id': id })
    })
    .then(res => res.json())
    .then(res => console.log(res));
  }

  // get a specific barcode
  getBarcode = (id) => {
    fetch("/barcode", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'id': id })
    })
    .then(res => res.json())
    .then(res => console.log(res));
  }

  componentDidMount = () => {
    this.getGroups()
  };


  render() {
    return (
      <div >
        
      </div>
    );
  }
}

export default Profile;
