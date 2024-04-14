import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { TrackService } from '../../services/track/track.service';

@Component({
  selector: 'app-compatibility',
  templateUrl: './compatibility.component.html',
  styleUrl: './compatibility.component.scss'
})
export class CompatibilityComponent implements OnInit {
  playlists: any[] = [];
  track: any;
  token = '';
  trackId = '';
  input = ''; // For new playlist's name
  result: any;
  userId = '';
  inputField = false;
  hiddenFeatures = ['analysis_url', 'id', 'track_href', 'type', 'uri', 'duration_ms'];
  
  constructor(private spotify: SpotifyService, private playlistService: PlaylistService, 
    private trackService: TrackService) {}

  ngOnInit() {
    const storedToken = sessionStorage.getItem('token');
    const storedId = sessionStorage.getItem("trackId");
    if (storedToken) {
      this.token = storedToken;
    }
    if (storedId) {
      this.trackId = storedId;
    }

    // Get playlists and their average features (normalized and filtered)
    this.spotify.getPlaylists(this.token).subscribe((response: any) => {
      this.playlists = response;
    });
      
    // Get selected track and its features (normalized and filtered)
    this.spotify.getTrack(this.token, this.trackId).subscribe((response: any) => {
      this.track = response;
    });

    // Get userID (needed for adding a new playlist)
    this.spotify.getUserInfo(this.token).subscribe((response: any) => {
      this.userId = response.id;
    })

        // Calculating selected track's compatibility with each playlist
     // this.playlists.forEach(playlist => {
      //  playlist.compatibility = this.calculateCompatibility(this.track.features, playlist.averages)
    //});
  }

  // for chosen track
  toggleFeatures() {
    this.track.displayFeatures = !this.track.displayFeatures;
  }

  // for playlist
  toggleAverages(playlist: any) {
    playlist.displayAverages = !playlist.displayAverages
  }

  toggleColour(event: any) {
    event.target.classList.toggle('select')
  }

  // Calculate similarity of a track's and a playlist's features
  calculateCompatibility(trackFeatures: any, playlistAverages: any) {
    let sum = 0; 
    for (const feature of Object.keys(trackFeatures)) {
      sum += Math.pow(trackFeatures[feature] - playlistAverages[feature], 2);
    }
    return Math.round((1 - Math.sqrt(sum / Object.keys(trackFeatures).length)) * 100);
  }

  addToPlaylist(playlist: any) {
    this.spotify.addPlaylistTracks(this.token, playlist.id, [this.track.uri]).subscribe(
      (response) => {
        console.log("Tracks added successfully:", response);
      },
      (error) => {
        console.error("Error adding tracks to playlist:", error);
      }
    );
  }

  toggleInputField() {
    this.inputField = !this.inputField;
  }

  createPlaylist() {
    this.spotify.createPlaylist(this.token, this.userId, this.input).subscribe(
      (response) => {
        console.log("Playlist created successfully:", response);
      },
      (error) => {
        console.error("Error creating playlist:", error);
      }
    );
  }
}