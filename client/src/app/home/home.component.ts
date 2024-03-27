import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from '../spotify.service';
import { ApiService } from '../api.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  message: any
  userInfo: any;
  token = '';
  username = '';
  displayName = '';


  constructor(private spotify: SpotifyService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getMessage().subscribe(data => { 
			this.message = data; 
		});

    const storedToken = sessionStorage.getItem('token');

    if (storedToken != null) {
      this.token = storedToken; 
      this.spotify.getUserInfo(this.token).then(userInfoObservable => {
        userInfoObservable.subscribe(userInfo => {
        this.userInfo = userInfo;
      
      });
    });
  }
}

}
