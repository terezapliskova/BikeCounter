export class StatsByDirection {
    lastCount: number;
    avgCount: number;

    constructor(fields?: StatsByDirection) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
