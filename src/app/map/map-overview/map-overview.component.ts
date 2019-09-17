import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonComponent } from 'src/app/common/common.component';
import { AppSettings } from 'src/app/app-settings';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/shared/users.service';
import { LocalAuthService } from 'src/app/auth/shared/local-auth.service';
import { Bikecounter } from 'src/app/actual-situation/shared/bikecounter';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { ToolbarComponent, SidenavComponent } from 'common-components';
import { BikecounterService } from 'src/app/actual-situation/shared/bikecounter.service';
import { MapComponent } from '../map.component';
import { BikecounterFivemistats } from 'src/app/actual-situation/shared/bikecounter-fivemistats';
import { BikeListComponent } from './bike-list/bike-list.component';
import { FirebaseAuthService } from 'src/app/auth/shared/firebase-auth.service';
import { StatisticsService } from 'src/app/localities/shared/statistics.service';
declare const Loader: any;



@Component({
    selector: 'app-map-overview',
    templateUrl: './map-overview.component.html',
    styleUrls: ['./map-overview.component.scss']
})
export class MapOverviewComponent extends CommonComponent implements OnInit, AfterViewInit, OnDestroy {

    //bikecounters: Bikecounter[];
    showMap = false;
    mapWidth = window.innerWidth;
    mapHeight = window.innerHeight - 65;
    @ViewChild('toolbar') toolbar: ToolbarComponent;
    @ViewChild('sidenav') sidenav: SidenavComponent;
    @ViewChild('map-container') mapContainer: ElementRef;
    @ViewChild('map') map: MapComponent;
    @ViewChild('bikeList') bikeList: BikeListComponent;

    today = new Date().toISOString().slice(0, 10);
    time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    startTime = '00:00:00';


    showListInfo = true;

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
        super(dialog, translate, snackBar, router, userService, auth, bikeCounterService, firebaseService, staticsService);
        Loader.load();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mapWidth = window.innerWidth;
        this.mapHeight = window.innerHeight - 65;
    }

    ngOnInit() {
        this.toolbar.showProgressBar = false;
        AppSettings.refreshBikecounters = true;
        this.initAuthData();
        this.getBikecounters();
        if (!this.refreshIntervalIsCreated) {
            this.createRefreshInterval();
        }


    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.showMap = true;
        }, this.timeout);

    }



    changeShowListInfo() {
        this.showListInfo = !this.showListInfo;
    }

    selectBikeToMap(bc: string) {
        this.map.selectBikecounter(bc);
    }

    selectBikeToList(bc: string) {
        this.bikeList.setSelected(bc);
    }

    ngOnDestroy() {
        AppSettings.refreshBikecounters = false;
    }


}
