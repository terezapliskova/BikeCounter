import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonComponent } from 'src/app/common/common.component';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../users/shared/users.service';
import { LocalAuthService } from '../../auth/shared/local-auth.service';
import { BikecounterService } from '../shared/bikecounter.service';
import { MatDialog, MatSnackBar, MatSidenav } from '@angular/material';
import { Bikecounter } from '../shared/bikecounter';
import { AppSettings } from 'src/app/app-settings';
import { FirebaseAuthService } from 'src/app/auth/shared/firebase-auth.service';
import { StatisticsService } from 'src/app/localities/shared/statistics.service';
declare const Loader: any;

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends CommonComponent implements OnInit, AfterViewInit, OnDestroy {

    showProgressBar = false;
    BCId: string;
    bikecounter: Bikecounter;
    today = new Date().toISOString().slice(0, 10);
    time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    startTime = '00:00:00';
    showMap = false;
    timeout = AppSettings.mapTimeout;
    width: number;
    height: number;


    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public userService: UsersService,
        protected auth: LocalAuthService,
        public firebaseService: FirebaseAuthService,
        public bikeCounterService: BikecounterService,
        public staticsServices: StatisticsService,
        private route: ActivatedRoute) {
        super(dialog, translate, snackBar, router, userService, auth, bikeCounterService, firebaseService, staticsServices)
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.setWidthHeight();
    }

    ngOnInit() {
        Loader.load();
        this.BCId = this.route.snapshot.params['id'];
        this.bikeCounterService.getBikeCounterById(this.BCId).then(bc => {
            const bikes = [bc];
            this.staticsServices.updateFiveminStats(bikes, this.today, this.startTime, this.today, this.time).then(b => {
                this.bikecounter = b[0];
            });
        });
        this.setWidthHeight();
    }

    setWidthHeight() {
        if (AppSettings.isDesktop()) {
            this.width = window.innerWidth / 2;
            this.height = window.innerHeight / 2;
        } else {
            this.width = window.innerWidth;
            this.height = window.innerHeight / 2;
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.showMap = true;
        }, this.timeout);
    }

    logout() {
        this.firebaseService.logout();
        //this.auth.logout();
        this.router.navigateByUrl('/auth');
    }

    detail() {
        //TODO: editace uzivatele
    }

    ngOnDestroy() {

    }


}
