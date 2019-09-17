import { CalculationState } from './calculation-state.enum';

export class BikecounterStats {
    // tslint:disable:variable-name
    id: number;
    bikecounter: string;
    hour_time?: string;
    hour_time_local?: string;
    fivemin_time?: string;
    fivemin_time_local?: string;
    direction_id: string;
    detection_count_dir0: number;
    detection_count_dir1: number;
    detection_count: number;
    velocity_avg: number;
    temperature?: number;


    constructor(fields?: BikecounterStats) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
