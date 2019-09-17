export class TimeZones {
    id: number;
    name: string;

    constructor(fields?: TimeZones) {
        if (fields) {
            Object.assign(this, fields);
        }
    }

}
