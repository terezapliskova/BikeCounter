import { Component, OnInit, Input, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Bikecounter } from 'src/app/actual-situation/shared/bikecounter';
import { AppSettings } from 'src/app/app-settings';
import { StatisticsService } from '../shared/statistics.service';
import * as moment from 'moment';
import { StatsByDirection } from '../shared/stats-by-direction';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { ChartService } from '../shared/chart.service';
import { ToolbarComponent } from 'common-components';


@Component({
    selector: 'app-hour-overview',
    templateUrl: './hour-overview.component.html',
    styleUrls: ['./hour-overview.component.scss']
})
export class HourOverviewComponent implements OnInit, AfterViewInit {

    showMap = false;
    timeout = AppSettings.mapTimeout;
    @Input() bikecounter: Bikecounter;
    @Input() toolbar: ToolbarComponent;
    mapWidth = window.innerWidth;
    mapHeight = window.innerHeight / 1.8;
    stats: StatsByDirection[] = [];
    dataLoaded = false;
    lineChart: any;
    dirnames: string[] = [];
    icon = '';
    actualWeather: any;
    forecast: any;


    constructor(
        private staticticService: StatisticsService,
        public translate: TranslateService,
        public chartService: ChartService) { }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mapWidth = window.innerWidth;
        this.mapHeight = window.innerHeight / 2.2;
    }


    ngOnInit() {
        this.getWeather();
        Promise.all(this.getBCHourStats()).then(() => {
            this.dataLoaded = true;

            const datasets = [
                {
                    label: this.translate.instant('BIKECOUNTER.LAST_HOUR_DETECTION_COUNT'),
                    data: this.stats.map(s => s.lastCount),
                    backgroundColor: 'rgba(32, 118, 223, 0.9)',
                },
                {
                    label: this.translate.instant('BIKECOUNTER.AVG_MONTH_COUNT'),
                    data: this.stats.map(s => s.avgCount),
                    backgroundColor: 'rgba(32, 118, 223, 0.55)',
                }
            ];

            this.lineChart = this.chartService.creatChart('lineChart', 'bar', datasets, this.dirnames, false, '', false, false);


        });

    }

    getDate(d): string {
        moment.locale(AppSettings.translate.defaultLanguage);
        return moment(d).format('llll');
    }

    getBCHourStats(): Promise<any>[] {
        const promises: Promise<any>[] = [];

        if (this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.id']) {
            this.dirnames.push(this.translate.instant('APP.DIRECTION') + ': '
                + this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.desc']);
            promises.push(this.staticticService.getLastHourStatByDirectionId(
                this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.0.id'])
                .then((dir0) => {
                    this.stats.push(dir0);
                }));
        }

        if (this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.id']) {
            this.dirnames.push(this.translate.instant('APP.DIRECTION') + ': '
                + this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.desc']);
            promises.push(this.staticticService.getLastHourStatByDirectionId(
                this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter]['directions.1.id'])
                .then((dir1) => {
                    this.stats.push(dir1);
                }));
        }

        return promises;
    }

    createHorizontalBarChart(name: string, labels: any[], data0: any, data1: any, bgColors: string[]): any {
        const arrayLabels = [];
        labels.forEach(l => { arrayLabels.push(this.formatLabel(l, 10)) });
        const lineChartMonth = new Chart(name, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: this.translate.instant('BIKECOUNTER.LAST_HOUR_DETECTION_COUNT'),
                        data: data0,
                        backgroundColor: 'rgba(32, 118, 223, 0.9)',
                    },
                    {
                        label: this.translate.instant('BIKECOUNTER.AVG_MONTH_COUNT'),
                        data: data1,
                        backgroundColor: 'rgba(32, 118, 223, 0.55)',
                    }
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: false,
                    position: 'top',
                    align: 'stretch'

                },
                tooltips: {
                    labels
                },
                scales: {
                    xAxes: [{
                        display: true,

                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,

                        }
                    }],
                },
                animation: {
                    duration: 2000
                }
            }
        });
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.tooltips.enabled = true;
        return lineChartMonth;
    }

    formatLabel(str, maxwidth): string[] {
        const sections = [];
        const words = str.split(' ');
        let temp = '';

        words.forEach((item, index) => {
            if (temp.length > 0) {
                const concat = temp + ' ' + item;

                if (concat.length > maxwidth) {
                    sections.push(temp);
                    temp = '';
                } else {
                    if (index === (words.length - 1)) {
                        sections.push(concat);
                        return;
                    } else {
                        temp = concat;
                        return;
                    }
                }
            }

            if (index === (words.length - 1)) {
                sections.push(item);
                return;
            }

            if (item.length < maxwidth) {
                temp = item;
            } else {
                sections.push(item);
            }

        });
        return sections;
    }

    getWeather() {
        this.staticticService.getWeather(this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter].position_lat,
            this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter].position_lng).then((v) => {
                this.icon = 'http://openweathermap.org/img/w/' + v.weather[0].icon + '.png';
                this.actualWeather = v;
            });
        this.staticticService.getHourForcast(this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter].position_lat,
            this.bikecounter.sensorConfiguration[this.bikecounter.bikecounter].position_lng).then(forc => {
                this.forecast = forc;
            });
    }

    ngAfterViewInit() {

        setTimeout(() => {
            this.showMap = true;
        }, this.timeout);

    }

}
