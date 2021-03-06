import React, { Component } from "react";
import "./App.css";
import SpotifyWebApi from "spotify-web-api-js"; // instantiating spotify API
import AppBar from "./components/AppBar.js";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Grid from '@material-ui/core/Grid';
// import StarIcon from '@material-ui/icons/StarBorder';
// import Toolbar from '@material-ui/core/Toolbar';
// import Link from '@material-ui/core/Link';
// import Container from '@material-ui/core/Container';
// import Box from '@material-ui/core/Box';
const spotifyApi = new SpotifyWebApi();

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    width: 500,
    height: 400
  }
}));

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: "Not Checked", albumArt: "" },
      featured: {
        name: "Click Button to View Featured Release",
        artist: "",
        albumType: "",
        image: ""
      },
      user: { name: "null" }
    };
  }

  // access to the token in order to use the API library
  getHashParams() {
    let hashParams = {};
    let e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  // function to get the song currently playing from the user's account
  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url
        }
      });
    });
  }

  getTopArtists() {
    let link =
      "https://api.spotify.com/v1/me/top/artists/" +
      spotifyApi.getAccessToken();
    axios.get(link).then(res => {
      alert(res);
    });
  }

  getNewReleases() {
    let link = "https://api.spotify.com/v1/browse/new-releases?country=SE";
    spotifyApi.getNewReleases().then(response => {
      let newReleases = "";
      for (let i = 0; i < response.albums.items.length; i++) {
        newReleases += response.albums.items[i].name;
        newReleases += ", ";
      }
      alert(newReleases);
    });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getFeaturedRelease() {
    /*
      branched from newly released songs
    */
    let link = "https://api.spotify.com/v1/browse/new-releases?country=SE";
    spotifyApi.getNewReleases().then(response => {
      let maxLength = response.albums.items.length;
      let randomInt = this.getRandomInt(maxLength);
      // let featuredSong = response.albums.items[this.getRandomInt(maxLength)].name;
      this.setState({
        featured: {
          name: response.albums.items[randomInt].name,
          artist: response.albums.items[randomInt].artists[0].name,
          albumType: response.albums.items[randomInt].album_type,
          image: response.albums.items[randomInt].images[1].url // fix this
        }
      });
    });
  }

  getUsername() {
    let link = "https://api.spotify.com/v1/me";
    spotifyApi.getUser().then(response => {
      this.setState({
        user: {
          name: response.type
        }
      });
    });
  }

  render() {
    return (
      <div className="App">
        {/* Navigation Bar */}
        <AppBar />
        {/* Display user name */}
        {/* <b>Welcome </b> { this.state.user.name }
        {this.state.loggedIn &&
          <button onClick={() => this.getUsername()}>
            Show User Name
          </button>
        } */}
        {/* Display what is currently playing */}
        <b>Now Playing:</b> {this.state.nowPlaying.name}
        {this.state.loggedIn && (
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        )}
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 300 }} />
        </div>
        {/* Display new releases */}
        <b>Newest Releases:</b>
        {this.state.loggedIn && (
          <button onClick={() => this.getNewReleases()}>
            Check New Releases
          </button>
        )}
        {/* Display "featured song" and details about it*/}
        <div>
          <b>Featured New Release:</b>
        </div>
        {this.state.featured.name} <br></br>
        ARTIST: <i>{this.state.featured.artist}</i> || ALBUM TYPE:{" "}
        <i>{this.state.featured.albumType}</i>
        <br></br>
        <div>
          <img src={this.state.featured.image} style={{ height: 300 }} />
        </div>
        {this.state.loggedIn && (
          <button onClick={() => this.getFeaturedRelease()}>
            Check Featured Song
          </button>
        )}
      </div>
    );
  }
}

export default App;
