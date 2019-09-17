import { Role } from '../../auth/shared/role.enum';

export class User {

  uid: string;
  email: string;
  password?: string;
  role: Role;


  constructor(fields?: User) {
      if (fields) {
          Object.assign(this, fields);
      }
  }

}
