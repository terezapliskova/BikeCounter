import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BikecounterHourstats } from 'src/app/actual-situation/shared/bikecounter-hourstats';
import { environment } from 'src/environments/environment';
import { AppSettings } from 'src/app/app-settings';
import { StatsByDirection } from './stats-by-direction';
import { Bikecounter } from 'src/app/actual-situation/shared/bikecounter';
import { ThermometerFiveminStats } from 'src/app/actual-situation/shared/thermometer-fivemin-stats';
import { CountedStats } from 'src/app/actual-situation/shared/counted-stats';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {

    directionHourUrl = 'direction/hour';
    //directionMonthUrl = 'direction/month';
    statsUrl = 'stats';
    watherUrl = 'https://api.openweathermap.org/';

    constructor(private http: HttpClient) { }

    getLastHourStatByDirectionId(dirId: string): Promise<StatsByDirection> {
        return this.http.get(environment.apiEndpoint + '/' + this.statsUrl + '/' + this.directionHourUrl + '/' + dirId,
            { observe: 'response' })
            .toPromise()
            .then(response => {
                return response.body as StatsByDirection;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    getWeather(lat: string, lng: string): Promise<any> {
        return this.http.get(
            this.watherUrl + 'data/2.5/weather?' + 'lat=' + lat + '&lon=' + lng + '&units=metric&lang=cz&appid='
            + AppSettings.weatherAPIKey,
            { observe: 'response' }
        )
            .toPromise()
            .then(response => {
                return response.body;
            })
            .catch(this.handleError);
    }

    getHourForcast(lat: string, lng: string): Promise<any> {
        return this.http.get(
            this.watherUrl + 'data/2.5/forecast?' + 'lat=' + lat + '&lon=' + lng + '&units=metric&lang=cz&appid='
            + AppSettings.weatherAPIKey,
            { observe: 'response' }
        )
            .toPromise()
            .then(response => {
                return response.body;
            })
            .catch(this.handleError);
    }

    getStatFromFivemin(
        id: string,
        fromDay: string,
        fromTime: string,
        toDay: string,
        toTime: string,
        dir0: string,
        dir1: string,
        thermometer: string
    ): Promise<CountedStats> {
        return this.http.post(environment.apiEndpoint + '/' + this.statsUrl + '/bikes/statByFive/',
            { id, fromDay, fromTime, toDay, toTime, dir0, dir1, thermometer },
            { observe: 'response' })
            .toPromise()
            .then(response => {
                const cs = response.body[0] as CountedStats;
                cs.avgTemperature = Math.round(cs.avgTemperature);
                return cs;
            })
            .catch(this.handleError);
    }

    getStatFromHour(
        id: string,
        fromDay: string,
        fromTime: string,
        toDay: string,
        toTime: string,
        dir0: string,
        dir1: string,
        thermometer: string
    ): Promise<CountedStats> {
        return this.http.post(environment.apiEndpoint + '/' + this.statsUrl + '/bikes/statByHour/',
            { id, fromDay, fromTime, toDay, toTime, dir0, dir1, thermometer },
            { observe: 'response' })
            .toPromise()
            .then(response => {
                return response.body[0] as CountedStats;
            })
            .catch(this.handleError);
    }

    getFiveminStatsByBikecounter(
        id: string,
        fromDay: string,
        fromTime: string,
        toDay: string,
        toTime: string,
        dir0: string,
        dir1: string,
        thermometer: string
    ): Promise<CountedStats[]> {
        return this.http.post(environment.apiEndpoint + '/' + this.statsUrl + '/bikes/fivemin/',
            { id, fromDay, fromTime, toDay, toTime, dir0, dir1, thermometer },
            { observe: 'response' })
            .toPromise()
            .then(response => {
                const cs = response.body as CountedStats[];
                cs.map(c => c.velocityAvg = Math.round(c.velocityAvg));
                return cs;
            })
            .catch(this.handleError);
    }

    getHourStatsByBikecounter(
        id: string,
        fromDay: string,
        fromTime: string,
        toDay: string,
        toTime: string,
        dir0: string,
        dir1: string,
        thermometer: string
    ): Promise<CountedStats[]> {
        return this.http.post(environment.apiEndpoint + '/' + this.statsUrl + '/bikes/hour/',
            { id, fromDay, fromTime, toDay, toTime, dir0, dir1, thermometer },
            { observe: 'response' })
            .toPromise()
            .then(response => {
                const cs = response.body as CountedStats[];
                cs.map(c => c.velocityAvg = Math.round(c.velocityAvg));
                return cs;
            })
            .catch(this.handleError);
    }

    getDayStatsByBikecounter(
        id: string,
        fromDay: string,
        fromTime: string,
        toDay: string,
        toTime: string,
        dir0: string,
        dir1: string,
        thermometer: string
    ): Promise<CountedStats[]> {
        return this.http.post(environment.apiEndpoint + '/' + this.statsUrl + '/bikes/day/',
            { id, fromDay, fromTime, toDay, toTime, dir0, dir1, thermometer },
            { observe: 'response' })
            .toPromise()
            .then(response => {
                const cs = response.body as CountedStats[];
                cs.map(c => c.velocityAvg = Math.round(c.velocityAvg));
                cs.map(c => c.actualTemperature = Math.round(c.actualTemperature));
                cs.map(c => c.humidity = Math.round(c.humidity));
                return cs;
            })
            .catch(this.handleError);
    }

    getFiveminStatsByThermometer(id: string, fromDay: string, fromTime: string, toDay: string, toTime: string):
        Promise<ThermometerFiveminStats[]> {
        return this.http.post(environment.apiEndpoint + '/' + this.statsUrl + '/thermometers/',
            { id, fromDay, fromTime, toDay, toTime },
            { observe: 'response' })
            .toPromise()
            .then(response => {
                return response.body as ThermometerFiveminStats[];
            })
            .catch(this.handleError);
    }


    getDirectionUniformity(a: number, b: number): string {
        if (a !== 0 || b !== 0) {
            const u = Math.round((a * 100) / (a + b)) + ' : ' + Math.round((b * 100) / (a + b));
            return u;
        } else {
            return '- : -';
        }
    }

    updateFiveminStats(bc: Bikecounter[], fromDay: string, fromTime: string, toDay: string, toTime: string): Promise<Bikecounter[]> {
        return new Promise((resolve, reject) => {
            let i = 0;
            bc.forEach(b => {
                this.getStatFromFivemin(
                    b.bikecounter,
                    fromDay,
                    fromTime,
                    toDay,
                    toTime,
                    b.sensorConfiguration[b.bikecounter]['directions.0.id'],
                    b.sensorConfiguration[b.bikecounter]['directions.1.id'],
                    b.sensorConfiguration[b.bikecounter].thermometer).then((s) => {
                        s.directionUniformity = this.getDirectionUniformity(
                            Number(s.detectionDir0Count),
                            Number(s.detectionDir1Count)
                        );
                        b.countedStats = s;

                        i++;
                        if (i === bc.length) {
                            resolve(bc);
                        }
                    });
            });
        });
    }



}
