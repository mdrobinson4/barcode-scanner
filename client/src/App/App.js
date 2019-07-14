import React, { Component } from "react";
import io from "socket.io-client"
import Login from "../Login/Login"
import Upload from "../Upload/Upload"
import Profile from "../Profile/Profile"
import { stringify } from "querystring"
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.history = [];
    this.state = {
        user: {},
        songs: [],
        loggedIn: false,
        page: "profile"
      };
  }

  componentDidMount = () => {
    this.socket = io();
    this.socket.on("get-songs", songs => {
      this.setState( { songs: songs } );
    });
  }

  handleLogin = (user) => {
    this.setState( { user: user, loggedIn: true } );
  }

  changePage = (e) => {
    e.persist();
    this.history.push( e.target.name );
    this.setState( { page: e.target.name } );
    if (e.target.name === "profile") {
      this.socket.emit("get-songs", this.state.user._id);
    }
  }

  render() {
    console.log(this.state.songs);
    const { page, loggedIn } = this.state;
    return (
      <div>
          <ButtonToolbar>
            <Button variant="danger" name="upload" onClick={this.changePage}>Upload</Button>
            <Button variant="info" name="profile" onClick={this.changePage}>Profile</Button>
            <Button variant="light" name="listen" onClick={this.changePage}>Listen</Button>
          </ButtonToolbar>
          {
            page === "profile" ? (
              loggedIn === true ? (
                <Profile socket={ this.socket } user={this.state.user} songs={this.state.songs} />
              ): (
                <Login socket={ this.socket } handleLogin={ this.handleLogin } />
              )
            ): null
          }
        
        
      </div>
    );
  }
}

export default App;
