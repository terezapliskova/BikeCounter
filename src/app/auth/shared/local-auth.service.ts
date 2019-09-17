import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Credentials } from './credentials';
import { AuthResponse } from './auth-response';
import { User } from '../../users/shared/user';
import { AppSettings } from 'src/app/app-settings';
import { Role } from './role.enum';

@Injectable({
    providedIn: 'root'
})
export class LocalAuthService {

    loginUrl = 'auth/login';
    userUrl = 'user';

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: Credentials): Promise<any> {
        return this.http.post<AuthResponse>(environment.apiEndpoint + '/' + this.loginUrl + '/', credentials)
            .toPromise()
            .then((response) => {

                const user = new User(response.user);
                this.setToken(response.token);
                localStorage.setItem(AppSettings.user, JSON.stringify(user));

            });
    }

    loginWithSocialID(credentials: Credentials): Promise<any> {
        return this.http.post<AuthResponse>(environment.apiEndpoint + '/' + this.loginUrl + '/social', credentials)
            .toPromise()
            .then((response) => {

                const user = new User(response.user);
                this.setToken(response.token);
                localStorage.setItem(AppSettings.user, JSON.stringify(user));

            });
    }

    setToken(token: string) {
        localStorage.setItem(AppSettings.userToken, token);
    }

    getUser(): User {
        if (!this.hasStoragedUser()) {
            return null;
        }

        return JSON.parse(localStorage.getItem(AppSettings.user)) as User;
    }

    isAdmin(): boolean {
        return this.getUser().role === Role.admin;
    }

    getProfileName(): string {
        const user = this.getUser();
        return user.email;
    }

    hasStoragedUser(): boolean {
        if (localStorage.getItem(AppSettings.user) === null) {
            this.logout();
            return false;
        }

        return true;
    }

    logout() {
        localStorage.removeItem(AppSettings.user);
        localStorage.removeItem(AppSettings.userToken);
    }

    addUser(credentials: Credentials): Promise<any> {
        const newUser = new User();
        newUser.email = credentials.email;
        newUser.password = credentials.password;
        //newUser.username = credentials.username;
        newUser.role = Role.user;
        return this.http.post(environment.apiEndpoint + '/' + this.userUrl + '/', newUser)
            .toPromise()
            .then(response => response as User);
    }

    addSocialUser(user: User): Promise<any> {
        return this.http.post(environment.apiEndpoint + '/' + this.userUrl + '/', user)
            .toPromise()
            .then(response => response as User);
    }

    getToken(): string {
        return localStorage.getItem(AppSettings.userToken);
    }

}


