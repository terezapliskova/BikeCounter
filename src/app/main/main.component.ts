import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { BikecounterService } from '../actual-situation/shared/bikecounter.service';
import { FirebaseAuthService } from '../auth/shared/firebase-auth.service';
import { LocalAuthService } from '../auth/shared/local-auth.service';
import { CommonComponent } from '../common/common.component';
import { UsersService } from '../users/shared/users.service';
import { StatisticsService } from '../localities/shared/statistics.service';

declare const Loader: any;

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent extends CommonComponent implements OnInit {

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public userService: UsersService,
        protected auth: LocalAuthService,
        public bikeCounterService: BikecounterService,
        public firebaseService: FirebaseAuthService,
        public staticsService: StatisticsService) {
        super(dialog, translate, snackBar, router, userService, auth, bikeCounterService, firebaseService, staticsService)
    }

    ngOnInit() {
        Loader.load();
        this.initAuthData();
    }

    detail() {
        //TODO: editace uzivatele
    }

}
