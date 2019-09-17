import { Injectable } from '@angular/core';
import { Plugins, Filesystem, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { CountedStats } from 'src/app/actual-situation/shared/counted-stats';
import { AppSettings } from 'src/app/app-settings';
import { MatSnackBar } from '@angular/material';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Injectable({
    providedIn: 'root'
})
export class ExportService {

    pageSize = 595;
    leftMargin = 28;
    rightMargin = 28;
    topMargin = 56;
    bottomMargin = 56;
    lineWidth = 0.5;

    constructor(
        protected translate: TranslateService,
        public snackBar: MatSnackBar) { }

    makePDF(data: CountedStats[], graphs: boolean, title: string, fileName: string, dir0Name: string, dir1Name: string, graphsToLoad: any[]) {

        const pdf =
        {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [this.leftMargin, this.topMargin, this.rightMargin, this.bottomMargin],
            header: this.prepareHeader(fileName),
            footer: (currentPage, pageCount) => this.prepareFooter(currentPage, pageCount),
            content: []
        };

        pdf.content.push(this.prepareTable(data, dir0Name, dir1Name));
        if (graphs) {
            graphsToLoad.forEach(g => {
                pdf.content.push(this.loadGraphs(g));
            });
        }


        if (AppSettings.device === 'web') {
            pdfMake.createPdf(pdf).download(fileName + '.pdf');
        }

        if (AppSettings.device === 'android' || AppSettings.device === 'ios') {
            pdfMake.createPdf(pdf).getBase64(encodedString => {
                Plugins.Filesystem.writeFile({
                    path: fileName + '.pdf',
                    data: encodedString,
                    directory: FilesystemDirectory.Documents

                }).then(() =>
                    this.snackBar.open(this.translate.instant('LOCALITY.FILE_SAVE_TO_DOCUMENTS'),
                        'OK', { duration: AppSettings.defaultSnackBarDuration })
                );
            });

        }


    }


    prepareHeader(title: string) {
        return [
            {
                text: title,
                margin: [this.leftMargin, 28, 0, 0]
            },
            {
                canvas: [{
                    type: 'line',
                    x1: this.leftMargin, y1: 5, x2: this.pageSize - this.rightMargin, y2: 5,
                    lineWidth: this.lineWidth
                }]
            }
        ];
    }

    prepareFooter(currentPage, pageCount) {
        return [
            {
                canvas: [{
                    type: 'line',
                    x1: this.leftMargin, y1: 0, x2: this.pageSize - this.rightMargin, y2: 0,
                    lineWidth: this.lineWidth
                }]
            },
            {
                columns: [
                    {
                        text: AppSettings.title + ' ' + AppSettings.version,
                        width: '*',
                        margin: [this.leftMargin, 5, 0, 0],
                        alignment: 'left',
                        fontSize: 8
                    },
                    {
                        text: currentPage + '/' + pageCount,
                        width: '*',
                        margin: [0, 5, this.rightMargin, 0],
                        alignment: 'right',
                        fontSize: 8
                    }
                ]
            }
        ];
    }

    loadGraphs(graph: any): object {
        return {
            image: graph.toBase64Image(),
            width: this.pageSize - this.leftMargin - this.rightMargin
        }
    }

    prepareTable(data: CountedStats[], dir0Name: string, dir1Name: string): object {
        const body = [];
        body.push([
            this.translate.instant('APP.DATE_AND_TIME'),
            this.translate.instant('BIKECOUNTER.ALL_DETECTION_COUNT'),
            this.translate.instant('BIKECOUNTER.DETECTION_COUNT_DIRECTION') + ' ' + dir0Name,
            this.translate.instant('BIKECOUNTER.DETECTION_COUNT_DIRECTION') + ' ' + dir1Name,
            this.translate.instant('LOCALITY.VELOCITY_AVG'),
            this.translate.instant('LOCALITY.TEMPERATURE'),
            this.translate.instant('LOCALITY.HUMIDITY'),
        ]);
        data.forEach(d => {
            // const row = [];
            const row = [
                this.getDate(d.time),
                d.detectionCount,
                d.detectionDir0Count,
                d.detectionDir1Count,
                d.velocityAvg,
                d.actualTemperature,
                d.humidity
            ];
            body.push(row);
        });
        return {
            table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body
            },
            layout: 'lightHorizontalLines',
            fontSize: 11
        };
    }

    getDate(d): string {
        moment.locale(AppSettings.translate.defaultLanguage);
        return moment(d).format(AppSettings.dateFormat);
    }

    makeCSV(fileName: string, data: CountedStats[], dir0: string, dir1: string) {

        if (AppSettings.device === 'web') {
            const link = document.createElement('a');
            link.setAttribute('href', encodeURI('data:text/csv;charset=utf-8,\uFEFF' + this.prepareCSVData(data, dir0, dir1)));
            link.setAttribute('download', fileName + '.csv');
            document.body.appendChild(link);
            link.click();
        }


        if (AppSettings.device === 'android') {
            Plugins.Filesystem.writeFile({
                path: fileName + '.csv',
                data: this.prepareCSVData(data, dir0, dir1),
                directory: FilesystemDirectory.Documents

            }).then(() =>
                this.snackBar.open(this.translate.instant('LOCALITY.FILE_SAVE_TO_DOCUMENTS'),
                    'OK', { duration: AppSettings.defaultSnackBarDuration })
            );

        }
    }

    prepareCSVData(data: CountedStats[], dir0: string, dir1: string): string {
        let csv = this.translate.instant('APP.DATE_AND_TIME') + ';' +
            this.translate.instant('BIKECOUNTER.ALL_DETECTION_COUNT') + ';' +
            this.translate.instant('BIKECOUNTER.DETECTION_COUNT_DIRECTION') + ' ' + dir0 + ';' +
            this.translate.instant('BIKECOUNTER.DETECTION_COUNT_DIRECTION') + ' ' + dir1 + ';' +
            this.translate.instant('LOCALITY.VELOCITY_AVG') + ';' +
            this.translate.instant('LOCALITY.TEMPERATURE') + ';' +
            this.translate.instant('LOCALITY.HUMIDITY') + ';\n';
        data.forEach(d => {
            csv += this.getDate(d.time) + ';';
            csv += d.detectionCount + ';';
            csv += d.detectionDir0Count + ';';
            csv += d.detectionDir1Count + ';';
            csv += d.velocityAvg + ';';
            csv += d.actualTemperature + ';';
            csv += d.humidity + ';\n';
        });
        return csv;
    }

}
