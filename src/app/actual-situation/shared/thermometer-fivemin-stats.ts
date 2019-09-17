import { CalculationState } from './calculation-state.enum';

export class ThermometerFiveminStats {
    // tslint:disable:variable-name
    id: number;
    thermometer: string;
    fivemin_time: string;
    fivemin_time_local: string;
    temperature?: number;
    humidity: number;
    validity: number;
    calculation_note: string;
    calculation_state: CalculationState;
    insert_timestamp: string;
    update_timestamp: string;

    constructor(fields?: ThermometerFiveminStats) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
