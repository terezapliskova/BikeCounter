import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/auth/shared/firebase-auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    public firebaseService: FirebaseAuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.firebaseService.logout();
    this.router.navigateByUrl('/auth');
  }

}
