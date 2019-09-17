import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AppSettings } from '../app-settings';
import { FirebaseAuthService } from '../auth/shared/firebase-auth.service';
import { LocalAuthService } from '../auth/shared/local-auth.service';
import { CommonComponent } from '../common/common.component';
import { MapDialogComponent } from '../map/map-dialog/map-dialog.component';
import { UsersService } from '../users/shared/users.service';
import { Bikecounter } from './shared/bikecounter';
import { BikecounterService } from './shared/bikecounter.service';
import { StatisticsService } from '../localities/shared/statistics.service';

declare const Loader: any;



@Component({
    selector: 'app-actual-situation',
    templateUrl: './actual-situation.component.html',
    styleUrls: ['./actual-situation.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class ActualSituationComponent extends CommonComponent implements OnInit, OnDestroy {

    bikes: MatTableDataSource<Bikecounter> = new MatTableDataSource<Bikecounter>();
    displayedColumns = ['bikecounter', 'route', 'detectionCount', 'directionsUniformity', 'actTemperature', 'menu'];



    private paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.bikes.paginator = this.paginator;
        this.bikes.sort = this.sort;
    }

    expandedElement: Bikecounter | null;

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

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.setIsDesktop();
    }


    ngOnInit() {
        AppSettings.refreshBikecounters = true;
        Loader.load();
        this.getBikecounters(true);

        if (!this.refreshIntervalIsCreated) {
            this.createRefreshInterval(true);
        }

        this.setIsDesktop();

    }

    /*setBikecounters(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.bikeCounterService.getAllBikeCounters().then((bikes) => {
                this.bikeCounterService.updateFiveminStats(bikes, this.today, this.startTime, this.today, this.time).then(bc => {
                    this.bikes.data = bc;
                    localStorage.setItem(AppSettings.bikecounters, JSON.stringify(this.bikes.data));
                });
                resolve();
            });
        });
    }*/

    setIsDesktop() {
        if (this.isDesktop()) {
            this.displayedColumns = ['bikecounter', 'route', 'detectionCount', 'directionsUniformity', 'actTemperature', 'menu'];
        } else {
            this.displayedColumns = ['bikecounter', 'detectionCount', 'actTemperature', 'more'];
        }
    }




    openMap(bikecounter: Bikecounter) {
        const dialogRef = this.dialog.open(
            MapDialogComponent, {
                data: {
                    bikecounter
                }
            });
    }

    ngOnDestroy() {
        AppSettings.refreshBikecounters = false
    }

}
