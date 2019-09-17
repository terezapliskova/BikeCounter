import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { CommonComponent } from 'src/app/common/common.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/users/shared/users.service';
import { LocalAuthService } from 'src/app/auth/shared/local-auth.service';
import { BikecounterService } from 'src/app/actual-situation/shared/bikecounter.service';
import { Bikecounter } from 'src/app/actual-situation/shared/bikecounter';
import { ToolbarComponent } from 'common-components';
import { FirebaseAuthService } from 'src/app/auth/shared/firebase-auth.service';
import { StatisticsService } from '../shared/statistics.service';

declare const Loader: any;

@Component({
    selector: 'app-locality-detail',
    templateUrl: './locality-detail.component.html',
    styleUrls: ['./locality-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LocalityDetailComponent extends CommonComponent implements OnInit {

    BCId: string;
    bikecounter: Bikecounter;
    aprimaryCol = 'accent';
    showMap = false;
    tabIndex = 0;
    @ViewChild('toolbar') toolbar: ToolbarComponent;
    title: string;
    showSecondNav = true;

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public userService: UsersService,
        protected auth: LocalAuthService,
        public bikeCounterService: BikecounterService,
        private route: ActivatedRoute,
        public firebaseService: FirebaseAuthService,
        public statcsService: StatisticsService) {
        super(dialog, translate, snackBar, router, userService, auth, bikeCounterService, firebaseService, statcsService);
        Loader.load();
    }


    ngOnInit() {
        Loader.load();
        this.initAuthData();
        this.BCId = this.route.snapshot.params['id'];
        console.log(this.BCId);
        this.bikeCounterService.getBikeCounterById(this.BCId).then(bc => {
            this.title = bc.desc;
            const bike = [bc];
            this.statcsService.updateFiveminStats(bike, this.today, this.startTime, this.today, this.time).then(b => {
                this.bikecounter = b[0];
            });
        });

    }

    setTabIndex(num){
        this.tabIndex = num;
    }


    changeShowSecondNav(){
        this.showSecondNav = !this.showSecondNav;
    }


}
