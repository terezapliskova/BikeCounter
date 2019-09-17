import { CalculationState } from './calculation-state.enum';

export class BikecounterHourstats {
    // tslint:disable:variable-name
    id: number;
    bikecounter: string;
    hour_time: string;
    hour_time_local: string;
    direction_id: string;
    detection_count: number;
    velocity_avg: number;


    constructor(fields?: BikecounterHourstats) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
