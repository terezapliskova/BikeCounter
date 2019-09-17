import { Component, OnInit, ViewChild } from '@angular/core';
import { Navigation } from 'common-components';
import { AppSettings } from '../app-settings';
import { AppNavigations } from '../app-navigations';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatSnackBar, MatTableDataSource, MatTable } from '@angular/material';
import { Router } from '@angular/router';
import { UsersService } from '../users/shared/users.service';
import { User } from '../users/shared/user';
import { LocalAuthService } from '../auth/shared/local-auth.service';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import 'rxjs/add/operator/takeWhile';
import { BikecounterService } from '../actual-situation/shared/bikecounter.service';
import { Bikecounter } from '../actual-situation/shared/bikecounter';
import * as moment from 'moment';
import { FirebaseAuthService } from '../auth/shared/firebase-auth.service';
import { UsersFirebaseService } from '../users/shared/users-firebase.service';
import { Role } from '../auth/shared/role.enum';
import { StatisticsService } from '../localities/shared/statistics.service';


@Component({
    selector: 'app-common',
    templateUrl: './common.component.html',
    styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {
    navigationsModules: Navigation[] = AppNavigations.modules;
    navigationsApplication: Navigation[] = AppNavigations.application;
    navigationsPeronal: Navigation[];
    settings = AppSettings;
    users: MatTableDataSource<User> = new MatTableDataSource<User>();
    isAdmin: boolean;
    profileName = '';
    user: User;
    pageSize = AppSettings.pageSize;
    pageSizeOptions = AppSettings.pageSizeOptions;
    today = new Date().toISOString().slice(0, 10);
    time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    startTime = '00:00:00';
    bikes: MatTableDataSource<Bikecounter> = new MatTableDataSource<Bikecounter>();
    refreshIntervalIsCreated = false;
    timeout = AppSettings.mapTimeout;


    @ViewChild('tableBC') table: MatTable<Bikecounter>;

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public usersService: UsersService,
        protected auth: LocalAuthService,
        public bikeCounterService: BikecounterService,
        public firebaseService: FirebaseAuthService,
        public staticsService: StatisticsService) {
    }

    ngOnInit() {

    }

    initAuthData() {
        if (this.auth.getUser()) {
            this.isAdmin = this.auth.isAdmin();

            this.profileName = this.auth.getProfileName();
            this.user = this.auth.getUser();
            if (this.user.role === Role.service) {
                this.navigationsModules = AppNavigations.modulesService;
            } else {
                this.navigationsModules = AppNavigations.modules;
            }

            if(this.user){
                this.navigationsPeronal = AppNavigations.personal;
            }
        }
    }



    redirectLogin() {
        this.router.navigate(['/auth']);
    }

    protected openSnackBar(message: string) {
        this.snackBar.open(this.translate.instant(message), 'OK', { duration: AppSettings.defaultSnackBarDuration });
    }

    isEvenRow(row: number): boolean {
        return row % 2 === 0;
    }

    logout() {
        this.firebaseService.logout();
        this.initAuthData();
        this.router.navigateByUrl('/auth');
    }

    login() {
        this.router.navigateByUrl('/auth');
    }

    isDesktop(): boolean {
        return (window.innerWidth > AppSettings.desktopSize);
    }

    createRefreshInterval(updateTable?: boolean) {
        IntervalObservable.create(AppSettings.refreshInterval)
            .takeWhile(() => AppSettings.refreshBikecounters)
            .subscribe(() => {
                this.today = new Date().toISOString().slice(0, 10);
                this.time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
                this.staticsService.updateFiveminStats(this.bikes.data, this.today, this.startTime, this.today, this.time).then(bc => {
                    this.bikes.data = bc;
                    this.refreshIntervalIsCreated = true;
                    localStorage.setItem(AppSettings.bikecounters, JSON.stringify(this.bikes.data));
                    if (updateTable) {
                        this.table.renderRows();
                    }

                });
            });
    }

    getBikecounters(update?: boolean) {
        let bikecounter = JSON.parse(localStorage.getItem(AppSettings.bikecounters)) as Bikecounter[];
        if (!bikecounter || bikecounter.length === 0 || update) {
            this.timeout = this.timeout * 5;
            this.bikeCounterService.getBikeCounters().then((bikes) => {
                this.staticsService.updateFiveminStats(bikes, this.today, this.startTime, this.today, this.time).then(bc => {
                    bikecounter = bc;
                    localStorage.setItem(AppSettings.bikecounters, JSON.stringify(bikecounter));
                    this.bikes.data = bikecounter;
                });
            });
        } else {
            this.bikes.data = bikecounter;
        }

    }

    getDate(d): string {
        moment.locale(AppSettings.translate.defaultLanguage);
        return moment(d).format(AppSettings.dateFormat);
    }

}
