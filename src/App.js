import React, {Component} from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js'; // instantiating spotify API
import AppBar from './components/AppBar.js';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
const spotifyApi = new SpotifyWebApi();

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    width: 500,
    height: 400
  },
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
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      featured: { name: 'null', artist: 'null', albumType: 'null', type: 'null', image: 'null'}
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
          artist: response.albums.items[randomInt].artists, // fix this, figure out to get artist information
          albumType: response.albums.items[randomInt].album_type,
          type: response.albums.items[randomInt].type,
          image: response.albums.items[randomInt].image // fix this
        }
      });
    })
  }

  render() {

    return (
      <div className="App">
        
        {/* Navigation Bar */}
        <AppBar/>      

        <Paper>
          {/* Display what is currently playing */}
          <b>Now Playing:</b> {this.state.nowPlaying.name}
          {this.state.loggedIn &&
            <button onClick={() => this.getNowPlaying()}>
              Check Now Playing
          </button>
          }
          <div>
            <img src={this.state.nowPlaying.albumArt} style={{ height: 300 }} />
          </div>
        </Paper>

        {/* Display new releases */}
        <b>Newest Releases:</b>
        { this.state.loggedIn &&
          <button onClick={() => this.getNewReleases()}>
            Check New Releases
          </button>
        }

        {/* Display "featured song" */}
        <div>
        <b>Featured New Release:</b> 
        { this.state.loggedIn &&
          <button onClick={() => this.getFeaturedRelease()}>
            Check Featured Song
          </button>
        }
        </div>
        { this.state.featured.name }
      </div>
    );
  }
}

export default App;
