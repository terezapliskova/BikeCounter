import { Component, OnInit } from '@angular/core';
import { CommonComponent } from 'src/app/common/common.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UsersService } from '../shared/users.service';
import { LocalAuthService } from 'src/app/auth/shared/local-auth.service';
import { BikecounterService } from 'src/app/actual-situation/shared/bikecounter.service';
import { FirebaseAuthService } from 'src/app/auth/shared/firebase-auth.service';
import { FirebaseLocalitiesService } from 'src/app/actual-situation/shared/firebase-localities.service';
import { StatisticsService } from 'src/app/localities/shared/statistics.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends CommonComponent implements OnInit {

    favoriteLoc: string[] = [];

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public userService: UsersService,
        protected auth: LocalAuthService,
        public bikeCounterService: BikecounterService,
        public firebaseService: FirebaseAuthService,
        public firebaseFavLocService: FirebaseLocalitiesService,
        public staticsService: StatisticsService) {
        super(dialog, translate, snackBar, router, userService, auth, bikeCounterService, firebaseService, staticsService)
    }

  ngOnInit() {
    this.initAuthData();
    this.getFavoriteLocalities();
  }

  getFavoriteLocalities() {
    if (this.user) {
        this.firebaseFavLocService.findFavorite(this.user.uid).then(favorite => {
            this.favoriteLoc = favorite;
        });
    }
}

}
