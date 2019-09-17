import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    constructor() { }

    /*
    datasets: [
        {
            label: string,
            data: number[],
            backgroundColor: string,
            borderColor: string
        }
    ]
    */
    creatChart(name, type: string, datasets: any[], labels: string[], displayTitle: boolean, title: string, displayLegend: boolean, stacked: boolean): any {
        const statChart = new Chart(name, {
            type,
            data: {
                labels,
                datasets
            },
            options: {
                title: {
                    display: displayTitle,
                    text: title
                },
                responsive: true,
                legend: {
                    display: displayLegend,
                    position: 'top',
                    align: 'stretch'

                },
                tooltips: {
                    labels,
                },
                scales: {
                    xAxes: [{
                        display: true,

                    }],
                    yAxes: [{
                        display: true,
                        stacked,
                        ticks: {
                            autoSkip: true,
                            beginAtZero: true
                        }
                    }],
                },
                animation: {
                    duration: 1000
                },
                bezierCurve: false

            }
        });
        return statChart;
    }


    creatChartWith2Axis(name, type: string, datasets: any[], labels: string[], displayTitle: boolean, title: string, displayLegend: boolean, stacked: boolean): any {
        const statChart = new Chart(name, {
            type,
            data: {
                labels,
                datasets
            },
            options: {
                title: {
                    display: displayTitle,
                    text: title
                },
                responsive: true,
                legend: {
                    display: displayLegend,
                    position: 'top',
                    align: 'stretch'

                },
                tooltips: {
                    labels,
                },
                scales: {
                    xAxes: [{
                        display: true,

                    }],
                    yAxes: [{
                        id: 'A',
                        type: 'linear',
                        position: 'left',
                        display: true,
                        stacked,
                        ticks: {
                            autoSkip: true,
                            beginAtZero: true
                        }
                      }, {
                        id: 'B',
                        type: 'linear',
                        position: 'right',
                        display: true,
                        stacked,
                        ticks: {
                            autoSkip: true,
                            beginAtZero: true
                        }
                    }],
                },
                animation: {
                    duration: 1000
                },
                bezierCurve: false

            }
        });
        return statChart;
    }


}
