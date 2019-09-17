import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonComponent } from '../common/common.component';
import { UsersService } from '../users/shared/users.service';
import { LocalAuthService } from './shared/local-auth.service';
import { BikecounterService } from '../actual-situation/shared/bikecounter.service';
import { FirebaseAuthService } from './shared/firebase-auth.service';
import { StatisticsService } from '../localities/shared/statistics.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends CommonComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public translate: TranslateService,
    public snackBar: MatSnackBar,
    public router: Router,
    public userService: UsersService,
    protected auth: LocalAuthService,
    public bikeCounterService: BikecounterService,
    public firebaseService: FirebaseAuthService,
    public staticsService: StatisticsService
    ) {
    super(dialog, translate, snackBar, router, userService, auth, bikeCounterService, firebaseService, staticsService)
  }

  ngOnInit() {

  }

}
