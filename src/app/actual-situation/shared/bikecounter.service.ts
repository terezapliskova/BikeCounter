import { Injectable } from '@angular/core';
import { Bikecounter } from './bikecounter';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BikecounterFivemistats } from './bikecounter-fivemistats';
import { CountedStats } from './counted-stats';
import * as ini from 'ini';
import { ThermometerFiveminStats } from './thermometer-fivemin-stats';
import { UserLocality } from './user-Locality';
import { AppSettings } from 'src/app/app-settings';
//import { AuthService } from 'angular-6-social-login';
import { LocalAuthService } from 'src/app/auth/shared/local-auth.service';
import { BikecounterHourstats } from './bikecounter-hourstats';
import { BikecounterStats } from './bikecounter-stats';
import { TimeZones } from 'src/app/sensors-setting/shared/time-zones';

@Injectable({
    providedIn: 'root'
})
export class BikecounterService {

    bikeUrl = 'bike';
    userUrl = 'user';
    statsUrl = 'stats';
    commonUrl = 'common';
    activeBikecounters = AppSettings.activeBikecounters;

    constructor(
        private http: HttpClient,
        private auth: LocalAuthService) { }

    getBikeCounters(): Promise<Bikecounter[]> {
        return this.http.get(environment.apiEndpoint + '/' + this.bikeUrl + '/', { observe: 'response' })
            .toPromise()
            .then(response => {
                const body = response.body as Bikecounter[];
                const bc: Bikecounter[] = [];

                body.forEach(b => {
                    if (b.config && this.activeBikecounters.includes(b.bikecounter)) {
                        b.sensorConfiguration = ini.decode(b.config);
                        bc.push(b);
                    }
                });
                return bc;
            })
            .catch(this.handleError);
    }

    getAllBikeCounters(): Promise<Bikecounter[]> {
        return this.http.get(environment.apiEndpoint + '/' + this.bikeUrl + '/', { observe: 'response' })
            .toPromise()
            .then(response => {
                const body = response.body as Bikecounter[];
                const bc: Bikecounter[] = [];
                body.forEach(b => {
                    b.sensorConfiguration = ini.decode(b.config);
                    bc.push(b);
                });
                return bc;
            })
            .catch(this.handleError);
    }

    getAllBikecountersId(): Promise<string[]> {
        return this.http.get(environment.apiEndpoint + '/' + this.bikeUrl + '/', { observe: 'response' })
            .toPromise()
            .then(response => {
                const body = response.body as Bikecounter[];
                const bc: string[] = [];

                body.forEach(b => {
                    bc.push(b.bikecounter);
                });
                return bc;
            })
            .catch(this.handleError);
    }

    getBikeCounterById(id: string): Promise<Bikecounter> {
        return this.http.get(environment.apiEndpoint + '/' + this.bikeUrl + '/' + id, { observe: 'response' })
            .toPromise()
            .then(response => {
                const body = response.body as Bikecounter;
                if (body.config) {
                    body.sensorConfiguration = ini.decode(body.config);
                }
                return body;
            })
            .catch(this.handleError);
    }

    getTimeZones(): Promise<TimeZones[]> {
        return this.http.get(environment.apiEndpoint + '/' + this.commonUrl, { observe: 'response' })
            .toPromise()
            .then(response => {
                return response.body as TimeZones[];
            })
            .catch(this.handleError);
    }

    editBikecounter(bc: Bikecounter): Promise<any> {
        return this.http.patch(environment.apiEndpoint + '/' + this.bikeUrl, bc, { observe: 'response' })
            .toPromise()
            .then(response => {
                return response.body as any;
            })
            .catch(this.handleError);
    }

    addBikecounter(bc: Bikecounter): Promise<any> {
        return this.http.post(environment.apiEndpoint + '/' + this.bikeUrl, bc, { observe: 'response' })
            .toPromise()
            .then(response => {
                return response.body as any;
            })
            .catch(this.handleError);
    }

    deleteBikecounter(bc: Bikecounter): Promise<any> {
        return this.http.delete(environment.apiEndpoint + '/' + this.bikeUrl + '/' + bc.bikecounter, { observe: 'response' })
            .toPromise()
            .then(response => {
                return response.body as any;
            })
            .catch(this.handleError);
    }




    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}
