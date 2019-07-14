import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Songs.css";

class Songs extends Component {
  constructor(props) {
    super(props);
    this.state = { songs: [] };
  }

  componentDidMount = () => {
    this.props.socket.emit("get-all-songs");

    this.props.socket.on("get-all-songs", songs => {
        this.setState( { songs: songs } );
    })
  };

  render() {
    return (
      <div>
        <h2>All Songs</h2>

        <div className="songList">
          {this.state.songs.map((song, i) => {
            return (
                <h4>{ song.name }</h4>
              <audio controls>
                <source src={song.src} type={song.contentType} />
              </audio>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Songs;
