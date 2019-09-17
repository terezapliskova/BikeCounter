export class UserLocality {
    uid: string;
    location: string;

    constructor(fields?: UserLocality) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
