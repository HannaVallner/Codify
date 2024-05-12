import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SpotifyService {
  userinfo: any = null;
  playlists: any[] = [];

  constructor(private http: HttpClient) {}

  // Delete previously stored track from server
  deleteStoredTrack() {
    return this.http.delete('/api/track/delete', {
    withCredentials: true
    });
  }

  // Get current user's main info
  getUserInfo(token: string) {
    if (!this.userinfo) {
      const response = this.http.get('/api/user/info', {
        params: { token: token },
        withCredentials: true
      });
      this.userinfo = response;
    }
    return this.userinfo;
  }

  
  // Returns user's playlists
  getPlaylists(token: string) {
    return this.http.get(`/api/playlists/${token}`, {
      withCredentials: true
    });
  }


  // Returns a track from Spotify Web API (with its features, filtered and normalized)
  toggleTrack(token: string, trackId: string) {
    return this.http.get(`/api/tracks/${trackId}?token=${token}`, {
      withCredentials: true
    });
  }

  // Store the selected playlist in session management
  storePlaylist(playlist: any) {
    return this.http.post('/api/store_playlist', playlist, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  // Retrieve the selected playlist from session managemet
  getStoredPlaylist() {
    return this.http.get('/api/stored_playlist', {
      withCredentials: true
    });
  }

  // Returns a track from backend session management
  getStoredTrack() {
    return this.http.get('/api/stored_track', {
      withCredentials: true
    });
  }

  // Returns playlists (with compatibility measures and matching sorting) from backend session management
  getCompPlaylists() {
    return this.http.get('/api/comp_playlists', {
      withCredentials: true
    });
  }

  // Adds tracks to a given playlist
  addPlaylistTracks(token: string, playlistId: string, trackURIs: string[]) {
    return this.http.post(`/api/playlists/${playlistId}/add-tracks`, 
    { token, trackURIs }, {
      withCredentials: true
    });
  }

  // Create a new playlist and add the selected track to it
  createPlaylist(token: string, userId: string, playlistName: string) {
    return this.http.post('/api/playlists/create', 
    { token, userId, playlistName }, {
      withCredentials: true
    });
  }

  // Removes tracks from a given playlist
  removePlaylistTracks(token: string, playlistId: string, trackURI: string) {
    return this.http.delete(`/api/playlists/${playlistId}/remove-tracks`, {
      headers: { 'Content-Type': 'application/json' },
      body: { token, trackURI },
      withCredentials: true
  });
  }

  // Add the track that was previously deleted from a playlist to another one
  changeTrackPlaylist(token: string, playlistId: string, track: any) {
    return this.http.post(`/api/playlists/${playlistId}/add-track`, 
    { token, track }, {
      withCredentials: true
    });
  }

  // Search for tracks based on user input (can be artist's or song's name)
  searchForTracks(token: string, query: string) {
    return this.http.get(`/api/search/tracks?token=${token}&query=${query}`, {
      withCredentials: true
    });
  }

  // Send a request to get more of the playlist's songs
  loadMoreTracks(token: string) {
    return this.http.get(`/api/load-more-tracks?token=${token}`, {
      withCredentials: true
    });
  }

}