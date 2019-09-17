import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DateAdapter, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { AppSettings } from 'src/app/app-settings';
import * as moment from 'moment';
import { StatisticsService } from '../shared/statistics.service';
import { TranslateService } from '@ngx-translate/core';
import { BikecounterService } from 'src/app/actual-situation/shared/bikecounter.service';
import { Bikecounter } from 'src/app/actual-situation/shared/bikecounter';
import { BikecounterStats } from 'src/app/actual-situation/shared/bikecounter-stats';
import { CountedStats } from 'src/app/actual-situation/shared/counted-stats';
import { Chart } from 'chart.js';
import { ChartService } from '../shared/chart.service';
import { ExportService } from '../shared/export.service';
import { ToolbarComponent } from 'common-components';


@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
    maxDate = new Date();
    dateFrom: any;
    dateTo: any;
    hourStats = 0;
    validInputs = false;
    dataLoaded = false;
    showExportCSV = true;
    @Input() bikecounter: Bikecounter;
    @Input() toolbar: ToolbarComponent;
    timeTo = '00:00:00';
    timeFrom = '00:00:00';
    statsData: MatTableDataSource<CountedStats> = new MatTableDataSource<CountedStats>();
    displayColumns = ['time', 'detectionCount', 'detectionDir0Count', 'detectionDir1Count', 'velocityAvg', 'actualTemperature', 'humidity'];
    pageSize = 5;
    pageSizeOptions = AppSettings.pageSizeOptions;
    private paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.statsData.paginator = this.paginator;
        this.statsData.sort = this.sort;
    }
    statChart: any;
    temperatureChart: any;
    velocityChart: any;
    statChartPDF: any;
    temperatureChartPDF: any;
    velocityChartPDF: any;
    tabIndex = 0;
    canvas: any;



    constructor(
        private dateAdapter: DateAdapter<any>,
        private bikecounterService: BikecounterService,
        public translate: TranslateService,
        public chartService: ChartService,
        public exportService: ExportService,
        public staticsService: StatisticsService) { }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.setColumns();
    }

    ngOnInit() {
        this.dateAdapter.setLocale(AppSettings.translate.defaultLanguage);
        this.setColumns();
        if(AppSettings.device === 'android'){
            this.showExportCSV = false;
        }
    }

    setColumns() {
        if (this.isDesktop()) {
            this.displayColumns = ['time', 'detectionCount', 'detectionDir0Count', 'detectionDir1Count', 'velocityAvg', 'actualTemperature', 'humidity'];
        } else {
            this.displayColumns = ['time', 'detectionCount', 'velocityAvg', 'actualTemperature', 'humidity'];
        }
    }

    isDesktop(): boolean {
        return (window.innerWidth > AppSettings.desktopSize);
    }

    fromChanged(event) {
        this.dateFrom = event.value;
        this.findIfValidInputs();
    }

    toChanged(event) {
        this.dateTo = event.value;
        this.findIfValidInputs();

    }

    findIfValidInputs() {
        this.dataLoaded = false;
        this.validInputs = false;
        if (this.dateFrom && this.dateTo) {
            this.validInputs = true;
            this.loadData();
        }
    }

    loadGraph(event) {
        this.tabIndex = event.index;
        this.drawGraph(this.hourStats === 2);
    }

    loadData() {
        this.toolbar.showProgressBar = true;
        switch (this.hourStats) {
            case 0: {
                this.staticsService.getHourStatsByBikecounter(
                    this.bikecounter.bikecounter,
                    moment(this.dateFrom).format('YYYY-MM-DD'),
                    this.timeFrom,
                    moment(this.dateTo).format('YYYY-MM-DD'),
                    this.timeTo,
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.id'],
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.id'],
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter].thermometer)
                    .then((data) => {
                        this.statsData.data = data;
                        this.dataLoaded = true;
                        this.statsData.sort = this.sort;
                        this.drawGraph(false);
                        this.toolbar.showProgressBar = false;
                    });
                break;
            }
            case 1: {
                this.staticsService.getFiveminStatsByBikecounter(
                    this.bikecounter.bikecounter,
                    moment(this.dateFrom).format('YYYY-MM-DD'),
                    this.timeFrom,
                    moment(this.dateTo).format('YYYY-MM-DD'),
                    this.timeTo,
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.id'],
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.id'],
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter].thermometer).then((data) => {
                        this.statsData.data = data;
                        this.dataLoaded = true;
                        this.statsData.sort = this.sort;
                        this.drawGraph(false);
                        this.toolbar.showProgressBar = false;
                    });
                break;
            }
            case 2: {
                this.staticsService.getDayStatsByBikecounter(
                    this.bikecounter.bikecounter,
                    moment(this.dateFrom).format('YYYY-MM-DD'),
                    this.timeFrom,
                    moment(this.dateTo).format('YYYY-MM-DD'),
                    this.timeTo,
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.id'],
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.id'],
                    this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter].thermometer).then((data) => {
                        this.statsData.data = data;
                        this.dataLoaded = true;
                        this.statsData.sort = this.sort;
                        this.drawGraph(true);
                        this.toolbar.showProgressBar = false;
                    });
            }
        }

    }

    getSortedData(): CountedStats[] {
        if (this.statsData.sort) {
            return this.statsData.sortData(this.statsData.data, this.statsData.sort);
        } else {
            return this.statsData.data;
        }
    }

    drawGraph(day: boolean) {
        this.loadAllGraphsForPDF(day);
        switch (this.tabIndex) {
            case 0: {
                const detectionDataset = [
                    {
                        label: this.translate.instant('APP.DIRECTION') + ': '
                            + this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.desc'],
                        data: this.getSortedData().map(d => d.detectionDir0Count),
                        backgroundColor: 'rgba(32, 118, 223, 0.8)',
                    },
                    {
                        label: this.translate.instant('APP.DIRECTION') + ': '
                            + this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.desc'],
                        data: this.getSortedData().map(d => d.detectionDir1Count),
                        backgroundColor: 'rgba(32, 118, 223, 0.5)',
                    }];
                this.statChart = this.chartService.creatChart('statChart',
                    'line',
                    detectionDataset,
                    this.getSortedData().map(d => this.getDate(d.time, day)),
                    true,
                    this.translate.instant('LOCALITY.CYCLIST_DETECTION_BY_DIRECTION'),
                    true,
                    true);

                break;
            }
            case 1: {
                const temperatureDataset = [{
                    data: this.getSortedData().map(d => d.actualTemperature),
                    backgroundColor: 'rgba(208, 32, 48, 0.8)',
                    borderColor: 'rgba(208, 32, 48, 0.6)',
                    label: this.translate.instant('LOCALITY.TEMPERATURE'),
                    fill: false,
                    yAxisID: 'A',
                },
                {
                    data: this.getSortedData().map(d => d.humidity),
                    backgroundColor: 'rgba(32, 118, 223, 0.8)',
                    borderColor: 'rgba(32, 118, 223, 0.6)',
                    label: this.translate.instant('LOCALITY.HUMIDITY'),
                    fill: false,
                    yAxisID: 'B',
                }];
                this.temperatureChart = this.chartService.creatChartWith2Axis('temperatureChart',
                    'line',
                    temperatureDataset,
                    this.getSortedData().map(d => this.getDate(d.time, day)),
                    true,
                    this.translate.instant('LOCALITY.WEATHER_PLACE'),
                    true,
                    false);

                break;
            }
            case 2: {
                const velocityDataset = [{
                    data: this.getSortedData().map(d => d.velocityAvg),
                    backgroundColor: 'rgba(32, 118, 223, 0.8)',
                    borderColor: 'rgba(32, 118, 223, 0.6)',
                    fill: false
                }];
                this.velocityChart = this.chartService.creatChart('velocityChart',
                    'line',
                    velocityDataset,
                    this.getSortedData().map(d => this.getDate(d.time, day)),
                    true,
                    this.translate.instant('LOCALITY.VELOCITY_AVG'),
                    false,
                    false);

                break;
            }
        }
    }

    loadAllGraphsForPDF(day) {
        const detectionDataset = [
            {
                label: this.translate.instant('APP.DIRECTION') + ': '
                    + this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.desc'],
                data: this.getSortedData().map(d => d.detectionDir0Count),
                backgroundColor: 'rgba(32, 118, 223, 0.8)',
            },
            {
                label: this.translate.instant('APP.DIRECTION') + ': '
                    + this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.desc'],
                data: this.getSortedData().map(d => d.detectionDir1Count),
                backgroundColor: 'rgba(32, 118, 223, 0.5)',
            }];
        this.statChartPDF = this.chartService.creatChart('statChartPDF',
            'line',
            detectionDataset,
            this.getSortedData().map(d => this.getDate(d.time, day)),
            true,
            this.translate.instant('LOCALITY.CYCLIST_DETECTION_BY_DIRECTION'),
            true,
            true);

        const temperatureDataset = [{
            data: this.getSortedData().map(d => d.actualTemperature),
            backgroundColor: 'rgba(208, 32, 48, 0.8)',
            borderColor: 'rgba(208, 32, 48, 0.6)',
            label: this.translate.instant('LOCALITY.TEMPERATURE'),
            fill: false,
            yAxisID: 'A',
        },
        {
            data: this.getSortedData().map(d => d.humidity),
            backgroundColor: 'rgba(32, 118, 223, 0.8)',
            borderColor: 'rgba(32, 118, 223, 0.6)',
            label: this.translate.instant('LOCALITY.HUMIDITY'),
            fill: false,
            yAxisID: 'B',
        }];
        this.temperatureChartPDF = this.chartService.creatChartWith2Axis('temperatureChartPDF',
            'line',
            temperatureDataset,
            this.getSortedData().map(d => this.getDate(d.time, day)),
            true,
            this.translate.instant('LOCALITY.WEATHER_PLACE'),
            true,
            false);


        const velocityDataset = [{
            data: this.getSortedData().map(d => d.velocityAvg),
            backgroundColor: 'rgba(32, 118, 223, 0.8)',
            borderColor: 'rgba(32, 118, 223, 0.6)',
            fill: false
        }];
        this.velocityChartPDF = this.chartService.creatChart('velocityChartPDF',
            'line',
            velocityDataset,
            this.getSortedData().map(d => this.getDate(d.time, day)),
            true,
            this.translate.instant('LOCALITY.VELOCITY_AVG'),
            false,
            false);

    }



    setTimeFrom(event) {
        this.timeFrom = event;
        this.findIfValidInputs();
    }

    setTimeTo(event) {
        this.timeTo = event;
        this.findIfValidInputs();
    }

    selectChanged(event) {
        this.findIfValidInputs();
    }

    getDate(d, day: boolean): string {
        moment.locale(AppSettings.translate.defaultLanguage);
        if (day) {
            return moment(d).format('ddd DD-MM-YYYY');
        } else {
            return moment(d).format(AppSettings.dateFormat);
        }
    }

    prepareTitle(): string {
        return this.bikecounter.desc + ' (' +
            moment(this.dateFrom).format('DD-MM-YYYY') + ' ' +
            this.timeFrom + ' - ' +
            moment(this.dateTo).format('DD-MM-YYYY') + ' ' +
            this.timeTo + ') ' + this.getNameOfStats();
    }

    getNameOfStats(): string {
        let statName = '';
        switch (this.hourStats) {
            case 0: {
                statName = this.translate.instant('LOCALITY.HOUR_STATS');
                break;
            }
            case 1: {
                statName = this.translate.instant('LOCALITY.FIVEMIN_STATS');
                break;
            }
            case 2: {
                statName = this.translate.instant('LOCALITY.DAY_STATS');
                break;
            }
        }
        return statName;
    }
    getTypeOfStats(): string {
        let statName = '';
        switch (this.hourStats) {
            case 0: {
                statName = 'hour';
                break;
            }
            case 1: {
                statName = 'fivemin';
                break;
            }
            case 2: {
                statName = 'day';
                break;
            }
        }
        return statName;
    }

    prepareFileName(): string {
        return this.bikecounter.desc + '(' +
            moment(this.dateFrom).format('DD-MM-YYYY') + ' ' +
            this.timeFrom + ' - ' +
            moment(this.dateTo).format('DD-MM-YYYY') + ' ' +
            this.timeTo + ')_' + this.getTypeOfStats();
    }

    save(graphs: boolean) {
        this.exportService.makePDF(this.getSortedData(), graphs, this.prepareTitle(), this.prepareFileName(),
            this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.desc'],
            this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.desc'],
            [this.statChartPDF, this.temperatureChartPDF, this.velocityChartPDF]
        );
    }

    exportCSV() {
        this.exportService.makeCSV(
            this.prepareFileName(),
            this.getSortedData(),
            this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.desc'],
            this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.desc']
        );
    }

}
