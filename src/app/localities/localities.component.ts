import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonComponent } from '../common/common.component';
import { MatDialog, MatSnackBar, MatTable, MatPaginator, MatSort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UsersService } from '../users/shared/users.service';
import { LocalAuthService } from '../auth/shared/local-auth.service';
import { BikecounterService } from '../actual-situation/shared/bikecounter.service';
import { Bikecounter } from '../actual-situation/shared/bikecounter';
import { FirebaseAuthService } from '../auth/shared/firebase-auth.service';
import { FirebaseLocalitiesService } from '../actual-situation/shared/firebase-localities.service';
import { StatisticsService } from './shared/statistics.service';
declare const Loader: any;

@Component({
    selector: 'app-localities',
    templateUrl: './localities.component.html',
    styleUrls: ['./localities.component.scss']
})
export class LocalitiesComponent extends CommonComponent implements OnInit {

    displayedColumns = ['favorite', 'bikecounter', 'route'];
    favoriteLoc: string[] = [];
    @ViewChild('localityTable') localityTable: MatTable<Bikecounter[]>;
    private paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.bikes.paginator = this.paginator;
        this.bikes.sort = this.sort;
    }

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
        Loader.load();
        this.initAuthData();
        this.getBikecounters();
        this.getFavoriteLocalities();
        if (!this.refreshIntervalIsCreated) {
            this.createRefreshInterval();
        }

    }

    getFavoriteLocalities() {
        if (this.user) {
            this.firebaseFavLocService.findFavorite(this.user.uid).then(favorite => {
                this.favoriteLoc = favorite;
            });
        }
    }

    detail() {
        //TODO: editace uzivatele
    }

    addToFavorite(bc: string) {
        if (this.user) {
            this.firebaseFavLocService.addToFavorite(this.user.uid, bc);
            this.favoriteLoc.push(bc);
            this.localityTable.renderRows();

        }
    }

    deleteFromFavorite(bc: string) {
        if (this.user) {
            const locIndex = this.favoriteLoc.indexOf(bc);
            this.firebaseFavLocService.deleteFromFavorite(this.user.uid, bc).then(() => {
                this.favoriteLoc.splice(locIndex, 1);
                this.getFavoriteLocalities();
                this.localityTable.renderRows();
            });
        }
    }

    sortData(sort) {

        const data = this.bikes.data;
        if (!sort.active || sort.direction === '') {
            this.bikes.data = data;
            return;
        }
        this.bikes.data = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'bikecounter': return this.compare(a.desc, b.desc, sort.direction);
                case 'route': return this.compare(a.sensorConfiguration[a.bikecounter].route,
                    b.sensorConfiguration[b.bikecounter].route, sort.direction);
                case 'favorite': return this.compareFavorite(a.bikecounter, b.bikecounter, sort.direction);

                default: return 0;
            }
        });
        this.bikes.paginator = this.paginator;
        this.paginator._changePageSize(this.paginator.pageSize);
        this.paginator.firstPage();
        this.localityTable.renderRows();
    }

    compare(a: string, b: string, direction: string) {
        switch (direction) {
            case 'asc':
                return (a.toLowerCase() > b.toLowerCase() ? -1 : 1);
            case 'desc':
                return (a.toLowerCase() > b.toLowerCase() ? 1 : -1);
            case '':
                return 0;
        }

    }

    compareFavorite(a: string, b: string, direction: string) {

        switch (direction) {
            case 'asc':
                return (this.favoriteLoc.indexOf(a) < this.favoriteLoc.indexOf(b) ? -1 : 1);
            case 'desc':
                return (this.favoriteLoc.indexOf(a) < this.favoriteLoc.indexOf(b) ? 1 : -1);
            case '':
                return 0;
        }
    }

    openLocality(row) {
    }

}
