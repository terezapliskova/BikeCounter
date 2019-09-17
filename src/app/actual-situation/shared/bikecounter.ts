import { CountedStats } from './counted-stats';

export class Bikecounter {
    bikecounter: string;
    config: any;
    desc: string;
    position_tz: string;
    insert_timestamp: string;
    update_timestamp: string;
    sensorConfiguration?: any;
    countedStats?: CountedStats;
    favorite?: boolean;


    constructor(fields?: Bikecounter) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
