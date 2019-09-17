import { CalculationState } from './calculation-state.enum';

export class BikecounterFivemistats {
    // tslint:disable:variable-name
    id: number;
    bikecounter: string;
    fivemin_time: string;
    fivemin_time_local: string;
    direction_id: string;
    detection_count: number;
    detection_count_real: number;
    velocity_avg: number;
    velocity_avg_note: string;
    validity: number;
    calculation_note: string;
    calculation_state: CalculationState;
    insert_timestamp: string;
    update_timestamp: string;

    constructor(fields?: BikecounterFivemistats) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
