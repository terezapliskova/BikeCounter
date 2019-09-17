import { Role } from './role.enum';

export class UsersRole {

    role: Role;
    uid: string;


    constructor(fields?: UsersRole) {
      if (fields) {
          Object.assign(this, fields);
      }
    }
}
