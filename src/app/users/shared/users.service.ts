import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  usersUrl = 'user';

  constructor(private http: HttpClient) { }

  getUsers(): Promise<User[]> {
    return this.http.get(environment.apiEndpoint + '/' + this.usersUrl + '/', { observe: 'response' })
      .toPromise()
      .then(response => response.body as User[])
      .catch(this.handleError);
  }



  getUserBySocialId(id: string): Promise<User>{
    return this.http.get(environment.apiEndpoint + '/' + this.usersUrl + '/social/' + id, { observe: 'response' })
      .toPromise()
      .then(response => response.body as User)
      .catch(this.handleError);
  }

  deleteUser(id): Promise<any> {
    return this.http.delete(environment.apiEndpoint + '/' + this.usersUrl + '/' + id + '/')
        .toPromise()
        .catch(this.handleError);
}

  editUser(user): Promise<User> {
    return this.http.patch(environment.apiEndpoint + '/' + this.usersUrl + '/' + user.id + '/', user)
    .toPromise()
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
