export class Credentials {
  email?: string;
  password?: string;
  uid: string;
  role: string;


  constructor(fields?: Credentials) {
    if (fields) {
        Object.assign(this, fields);
    }
}
}
