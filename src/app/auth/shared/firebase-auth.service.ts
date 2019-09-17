import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/app-settings';
import * as firebase from 'firebase';
import * as fadmin from 'firebase-admin';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { UsersRole } from './users-role';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserDialogComponent } from 'src/app/users/user-dialog/user-dialog.component';
import { Role } from './role.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagingService } from 'src/app/auth/shared/messaging.service';
import { User } from 'src/app/users/shared/user';

import { Plugins, Browser } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService {

    usersRole: AngularFireList<UsersRole[]>;
    message;

    constructor(
        public auth: AngularFireAuth,
        public router: Router,
        public db: AngularFireDatabase,
        public afs: AngularFirestore,
        public messagingService: MessagingService
    ) {
    }

    login(email: string, password: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.auth.auth.signInWithEmailAndPassword(email, password)
                .then(user => {
                    this.storeUser(user)
                        .then(() => {
                            resolve()
                        });
                })
                .catch(err => {
                    console.log(err);
                    this.handleError(err);
                    reject();
                });
        });

    }

    loginWithSocial(prov: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let provider: any;
            if (prov === 'facebook') {
                provider = new firebase.auth.FacebookAuthProvider();
            } else if (prov === 'google') {
                provider = new firebase.auth.GoogleAuthProvider();
            }

            this.auth.auth.signInWithPopup(provider).then(user => {
                this.storeUser(user)
                    .then(() => {
                        resolve();
                    });
            })

                .catch(err => {
                    console.log(err);
                    this.handleError(err);
                    
                    reject();
                });
        });

    }


    storeUser(user): Promise<User> {
        return new Promise<any>((resolve, reject) => {
            this.getUserRole(user.user.uid)
                .then(role => {
                    console.log(role);
                    const creden = new User();
                    creden.email = user.user.email;
                    creden.uid = user.user.uid;
                    creden.role = role.role;
                    localStorage.setItem(AppSettings.user, JSON.stringify(creden));
                    resolve(creden);
                })
                .catch(err => {
                    this.createUserRole(user.user.uid, user.user.email, Role.user);
                    const creden = new User();
                    creden.email = user.user.email;
                    creden.uid = user.user.uid;
                    creden.role = Role.user;
                    localStorage.setItem(AppSettings.user, JSON.stringify(creden));
                    this.sendEmailVerification();
                    resolve(creden);
                });
        });

    }


    register(email: string, password: string, login: boolean, role: Role): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.auth.auth.createUserWithEmailAndPassword(email, password)
                .then(user => {
                    this.createUserRole(user.user.uid, user.user.email, role);
                    const creden = new User();
                    creden.email = user.user.email;
                    creden.uid = user.user.uid;
                    creden.role = Role.user;
                    if(login){
                        localStorage.setItem(AppSettings.user, JSON.stringify(creden));
                    }
                    this.sendEmailVerification();
                    resolve(user);
                })
                .catch(err => {

                    if (err.code === 'auth/email-already-in-use') {
                        reject('REGISTRATION.EMAIL_IN_USE');
                    }
                    this.handleError(err);
                });
        });
    }

    sendEmailVerification() {
        this.auth.auth.currentUser.sendEmailVerification();
    }

    logout() {
        this.auth.auth.signOut()
            .then(() => {
                localStorage.removeItem(AppSettings.user);
            })
            .catch(err => {
                this.handleError(err);
            });
    }

    navigateToMainPage() {
        this.router.navigate(['/main']);
    }

    initMessaging(uid) {
        this.messagingService.requestPermission(uid);
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;
        console.log(this.message);
    }

    loadUserRole(uid) {
        return this.afs.collection('usersRole', ref => ref.where('uid', '==', uid))
            .snapshotChanges();
    }

    createUserRole(uid, email, role) {
        this.afs.collection('usersRole').add({
            uid,
            role,
            email
        });
    }

    getUserRole(uid): Promise<UsersRole> {
        return new Promise<any>((resolve, reject) => {
            this.loadUserRole(uid).subscribe(result => {
                if (result.length === 0) {
                    reject();
                } else {
                    result.map(r => {
                        resolve(r.payload.doc.data() as UsersRole);
                    });
                }
            });
        });
    }

    private handleError(error: HttpErrorResponse): Promise<any> {
        return Promise.reject(error);
    }
}
