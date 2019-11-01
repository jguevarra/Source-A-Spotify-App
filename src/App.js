import React, {Component} from 'react';
import './App.css';
// instantiating spotify API
import SpotifyWebApi from 'spotify-web-api-js';
// import { AppBar } from '@material-ui/core';
import AppBar from './components/AppBar.js';

import axios from "axios";
const spotifyApi = new SpotifyWebApi();

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

      nowPlaying: { name: 'Not Checked', albumArt: '' }
    }
  }

  // access to the token in order to use the API library
  getHashParams(){
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  // function to get the song currently playing from the user's account
  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  getRandomTrack(){
    let link = 'https://api.spotify.com/v1/tracks';
    // reference William's code
    spotifyApi.getTracks().then(response => {
      let tracks = "";
      for (let i = 0; i < response.albums.items.length; i++) {
        tracks += response.albums.items[i].name;
        tracks += ", ";
      }
      alert(tracks);
    })
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

  render() {
    return (
      <div className="App">
        <AppBar/>
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        )}
        <button onClick={() => this.getNewReleases()}>
          Check New Releases
        </button>
      </div>
    );
  }
}

export default App;
