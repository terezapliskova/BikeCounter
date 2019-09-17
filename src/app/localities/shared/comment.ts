export class Comment {
    locality: string;
    text: string;
    userAlias: string;
    userUid: string;
    time: string;


    constructor(fields?: Comment) {
        if (fields) {
            Object.assign(this, fields);
        }
    }

}
