import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Bikecounter } from '../actual-situation/shared/bikecounter';
import { BikecounterService } from '../actual-situation/shared/bikecounter.service';
import { AppSettings } from '../app-settings';
import { LocalAuthService } from '../auth/shared/local-auth.service';
import { CommonComponent } from '../common/common.component';
import { UsersService } from '../users/shared/users.service';
import { GetBikecounterPipe } from './shared/get-bikecounter.pipe';
import { FirebaseAuthService } from '../auth/shared/firebase-auth.service';
import { StatisticsService } from '../localities/shared/statistics.service';

declare const SMap: any;
declare const JAK: any;
declare const Loader: any;



@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent extends CommonComponent implements OnInit, AfterViewInit {

    map;
    center;
    @Input() bikecounters: Bikecounter[];
    @Input() initWidth: number;
    @Input() initHeight: number;
    @Output() bcSelected: EventEmitter<string> = new EventEmitter<string>();
    zoom = 11;
    layer;
    width: number;
    height: number;
    markersList: any[];
    selected: string;

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public userService: UsersService,
        protected auth: LocalAuthService,
        private filterBC: GetBikecounterPipe,
        public bikeCounterService: BikecounterService,
        public firebaseService: FirebaseAuthService,
        public staticsService: StatisticsService) {
        super(dialog, translate, snackBar, router, userService, auth, bikeCounterService, firebaseService, staticsService);
        Loader.load();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.setMapHeightWidth();
    }

    ngOnInit() {
        this.setMapHeightWidth();
    }

    ngAfterViewInit() {
        this.initMap();
    }

    setMapHeightWidth() {
        if (!this.initWidth && !this.initHeight) {
            if (AppSettings.isDesktop()) {
                this.width = window.innerWidth / 2;
                this.height = window.innerHeight / 2;
            } else {
                this.width = window.innerWidth;
                this.height = window.innerHeight / 2;
            }
        } else {
            this.width = this.initWidth;
            this.height = this.initHeight;
        }
    }

    initMap() {

        if (this.bikecounters.length === 1 && this.bikecounters[0].sensorConfiguration) {
            this.center = SMap.Coords.fromWGS84(this.bikecounters[0].sensorConfiguration[this.bikecounters[0].bikecounter].position_lng,
                this.bikecounters[0].sensorConfiguration[this.bikecounters[0].bikecounter].position_lat);
            this.zoom = 13;

        } else {
            this.center = SMap.Coords.fromWGS84(14.4378005, 50.0755381);
        }

        this.map = new SMap(JAK.gel('m'), this.center, this.zoom);
        this.map.addControl(new SMap.Control.Sync());
        this.map.addDefaultLayer(SMap.DEF_TURIST).enable();
        const mouse = new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM);
        this.map.addControl(mouse);
        if (AppSettings.isDesktop()) {
            this.map.addDefaultControls();
        }



        this.setLocalitiesMarkers().then(() => {
            this.map.addLayer(this.layer);
            this.layer.enable();
            this.setSignals();
        });



    }

    setLocalitiesMarkers(selected?: string): Promise<any> {
        this.markersList = [];
        this.layer = new SMap.Layer.Marker();
        return new Promise((resolve, reject) => {
            let count = 0;
            this.bikecounters.forEach(bikecounter => {
                count++;
                let imageUrl = 'assets/map-marker-blue.svg';
                if (bikecounter.bikecounter === selected) {
                    imageUrl = 'assets/map-marker-light-blue.svg';
                }

                /* directions.0 marker */
                if (bikecounter.sensorConfiguration[bikecounter.bikecounter]['measurement_locality.0.position_lng']) {
                    const card0Center = SMap.Coords.fromWGS84(
                        bikecounter.sensorConfiguration[bikecounter.bikecounter]['measurement_locality.0.position_lng'],
                        bikecounter.sensorConfiguration[bikecounter.bikecounter]['measurement_locality.0.position_lat']
                    );
                    /*const card0 = new SMap.Card();
                    card0.getHeader().innerHTML = bikecounter.bikecounter;
                    card0.getBody().innerHTML = bikecounter.sensorConfiguration[bikecounter.bikecounter].camea_desc;*/
                    const options0 = {
                        title: bikecounter.desc + ' ' +
                            this.translate.instant('APP.DIRECTION') + ': ' +
                            bikecounter.sensorConfiguration[bikecounter.bikecounter]['directions.0.desc'],
                        url: imageUrl
                    };
                    const marker0 = new SMap.Marker(card0Center, bikecounter.bikecounter + '|0', options0);
                   // marker0.decorate(SMap.Marker.Feature.Card, card0);
                    this.markersList.push(marker0);
                    this.layer.addMarker(marker0);
                }

                /* directions.1 marker */
                if (bikecounter.sensorConfiguration[bikecounter.bikecounter]['measurement_locality.1.position_lng']) {
                    const card1Center = SMap.Coords.fromWGS84(
                        bikecounter.sensorConfiguration[bikecounter.bikecounter]['measurement_locality.1.position_lng'],
                        bikecounter.sensorConfiguration[bikecounter.bikecounter]['measurement_locality.1.position_lat']
                    );
                   /* const card1 = new SMap.Card();
                    card1.getHeader().innerHTML = bikecounter.bikecounter;
                    card1.getBody().innerHTML = bikecounter.sensorConfiguration[bikecounter.bikecounter].camea_desc;*/
                    const options1 = {
                        title: bikecounter.desc + ' ' +
                            this.translate.instant('APP.DIRECTION') + ': ' +
                            bikecounter.sensorConfiguration[bikecounter.bikecounter]['directions.1.desc'],
                        url: imageUrl
                    };
                    const marker1 = new SMap.Marker(card1Center, bikecounter.bikecounter + '|1', options1);
                    //marker1.decorate(SMap.Marker.Feature.Card);
                    this.markersList.push(marker1);

                    this.layer.addMarker(marker1);
                }
                if (count === this.bikecounters.length) {
                    resolve();
                }
            });

        });
    }



    selectBikecounter(bc: string) {
        this.map.removeLayer(this.layer);
        this.setLocalitiesMarkers(bc).then(() => {
            this.map.addLayer(this.layer);
            this.layer.enable();
        });
    }


    setSignals() {
        this.map.getSignals().addListener(this, "marker-click", (e) => {
            const marker = e.target;
            this.selected = this.filterBC.transform(marker.getId());
            this.bcSelected.emit(this.selected);
            this.selectBikecounter(this.selected);
        });

        this.map.getSignals().addListener(this, "card-close", (e) => {

        });
    }

}
