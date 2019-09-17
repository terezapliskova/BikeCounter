import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Bikecounter } from '../actual-situation/shared/bikecounter';
import { BikecounterService } from '../actual-situation/shared/bikecounter.service';
import { FirebaseAuthService } from '../auth/shared/firebase-auth.service';
import { LocalAuthService } from '../auth/shared/local-auth.service';
import { CommonComponent } from '../common/common.component';
import { UsersService } from '../users/shared/users.service';
import { DialogData, DialogType, DialogButtons, DialogComponent, DialogResult, ToolbarComponent, DialogTypes } from 'common-components';
import { AppSettings } from '../app-settings';
import { IniDialogComponent } from './ini-dialog/ini-dialog.component';
import { MapDialogComponent } from '../map/map-dialog/map-dialog.component';
import { AddSensorDialogComponent } from './add-sensor-dialog/add-sensor-dialog.component';
import { TimeZones } from './shared/time-zones';
import { StatisticsService } from '../localities/shared/statistics.service';
import * as ini from 'ini';

declare const Loader: any;

@Component({
    selector: 'app-sensors-setting',
    templateUrl: './sensors-setting.component.html',
    styleUrls: ['./sensors-setting.component.scss'],

})
export class SensorsSettingComponent extends CommonComponent implements OnInit {

    bikes: MatTableDataSource<Bikecounter> = new MatTableDataSource<Bikecounter>();
    displayedColumns = ['bikecounter', 'desc', 'position_tz', 'insert_timestamp', 'update_timestamp', 'menu'];
    @ViewChild('tableSensors') tableS: MatTable<Bikecounter>;

    private paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.bikes.paginator = this.paginator;
        this.bikes.sort = this.sort;
    }

    timeZones: TimeZones[] = [];
    @ViewChild('toolbar') toolbar: ToolbarComponent;
    bcIds: string[];


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
       this.setColumns();
    }

    ngOnInit() {
        Loader.load();
        this.initAuthData();
        this.getAllBikecounters();
        console.log(this.bikes);
        this.initTimeZones();
        this.bikeCounterService.getAllBikecountersId().then(bc => this.bcIds = bc);
        this.setColumns();
    }

    setColumns() {
        if (this.isDesktop()) {
            this.displayedColumns = ['bikecounter', 'desc', 'position_tz', 'insert_timestamp', 'update_timestamp', 'menu'];
        } else {
            this.displayedColumns = ['bikecounter', 'insert_timestamp', 'menu'];
        }
    }

    initTimeZones() {
        this.bikeCounterService.getTimeZones().then(tz => {
            this.timeZones = tz;
        });
    }

    getAllBikecounters() {
        this.bikeCounterService.getAllBikeCounters().then(b => this.bikes.data = b)
    }

    showIniDialog(bc: Bikecounter) {
        const dialogData: DialogData = {
            dialogType: DialogType.Message,
            translate: this.translate,
            title: 'SENSORS.INI_FILE',
            message: bc.config,
            buttons: DialogButtons.Close
        };
        const dialogRef = this.dialog.open(
            IniDialogComponent,
            { width: AppSettings.defaultDialogWidth, data: dialogData }
        );

    }

    openMap(bikecounter: Bikecounter) {
        const dialogRef = this.dialog.open(
            MapDialogComponent, {
                data: {
                    bikecounter
                }
            });
    }

    showEditDialog(bc: Bikecounter) {
        const dialogRef = this.dialog.open(
            AddSensorDialogComponent,
            {
                width: AppSettings.defaultDialogWidth,
                data: {
                    title: 'SENSORS.EDIT',
                    bikecounter: new Bikecounter(bc),
                    timeZones: this.timeZones,
                    dialogType: DialogTypes.Edit,
                    bcIds: this.bcIds
                }
            }
        );
        dialogRef.afterClosed()
            .subscribe((data: any) => {
                if (data && (data.bikecounter !== null && data.bikecounter !== undefined)) {
                    this.editSensor(data.bikecounter);
                }
            });
    }

    editSensor(bc: Bikecounter) {
        this.toolbar.showProgressBar = true;
        const index = this.getBcIndex(bc.bikecounter);
        this.bikeCounterService.editBikecounter(bc)
            .then(edited => {
                this.updateStoredBC(edited, index);
                this.openSnackBar('SENSORS.EDITED');
                this.toolbar.showProgressBar = false;
            })
            .catch(err => {
                this.openSnackBar('SENSORS.EDITED');
                this.toolbar.showProgressBar = false;
            });
    }

    updateStoredBC(bc: Bikecounter, index: number) {
        bc.sensorConfiguration = ini.decode(bc.config);
        this.bikes.data[index] = bc;
        this.bikes._updateChangeSubscription();
    }

    showDuplicateDialog(bc: Bikecounter) {
        bc.insert_timestamp = undefined;
        bc.update_timestamp = undefined;
        const dialogRef = this.dialog.open(
            AddSensorDialogComponent,
            {
                width: AppSettings.defaultDialogWidth,
                data: {
                    title: 'SENSORS.DUPLICATE',
                    bikecounter: new Bikecounter(bc),
                    timeZones: this.timeZones,
                    dialogType: DialogTypes.Add,
                    bcIds: this.bcIds
                }
            }
        );
        dialogRef.afterClosed()
            .subscribe((data: any) => {
                if (data && (data.bikecounter !== null && data.bikecounter !== undefined)) {
                    this.addBikecounter(data.bikecounter);
                }
            });
    }

    showNewDialog() {
        const dialogRef = this.dialog.open(
            AddSensorDialogComponent,
            {
                width: AppSettings.defaultDialogWidth,
                data: {
                    title: 'SENSORS.ADD',
                    bikecounter: new Bikecounter(),
                    timeZones: this.timeZones,
                    dialogType: DialogTypes.Add,
                    bcIds: this.bcIds
                }
            }
        );
        dialogRef.afterClosed()
            .subscribe((data: any) => {
                if (data !== null && data !== undefined) {
                    this.addBikecounter(data.bikecounter);
                }
            });
    }

    addBikecounter(bc: Bikecounter) {
        this.toolbar.showProgressBar = true;
        this.bikeCounterService.addBikecounter(bc)
            .then(b => {
                b.sensorConfiguration = ini.decode(b.config);
                this.bikes.data.push(b);
                this.bikes._updateChangeSubscription();
                this.openSnackBar('SENSORS.ADDED');
                this.toolbar.showProgressBar = false;
            })
            .catch(err => {
                this.openSnackBar('SENSORS.ADDED');
                this.toolbar.showProgressBar = false;
            });

    }


    showDeleteDialog(bc: Bikecounter) {
        const dialogData: DialogData = {
            dialogType: DialogType.Confirm,
            translate: this.translate,
            title: 'SENSORS.DELETE',
            message: this.translate.instant('SENSORS.DELETE_CONFIRMATION').replace('%SENSOR%', bc.desc),
            buttons: DialogButtons.YesNo
        };
        const dialogRef = this.dialog.open(
            DialogComponent,
            { width: AppSettings.defaultDialogWidth, data: dialogData }
        );
        dialogRef.afterClosed()
            .subscribe((result: DialogResult) => {
                if (result === DialogResult.Yes) {
                    this.deleteBikecounter(bc)
                }
            });
    }

    private getBcIndex(id: string): number {
        return this.bikes.data.findIndex(bc => {
            return bc.bikecounter === id;
        });
    }

    deleteBikecounter(bc) {
        this.toolbar.showProgressBar = true;
        const index = this.getBcIndex(bc.bikecounter);
        this.bikeCounterService.deleteBikecounter(bc)
            .then(b => {
                this.bikes.data.splice(index, 1);
                this.bikes._updateChangeSubscription();
                this.openSnackBar('SENSORS.DELETED');
                this.toolbar.showProgressBar = false;
            })
            .catch(err => {
                this.openSnackBar('SENSORS.NOT_DELETED');
                this.toolbar.showProgressBar = false;
            });

    }


}
