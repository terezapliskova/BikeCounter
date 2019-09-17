import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { AppSettings } from 'src/app/app-settings';
import * as admin from "firebase-admin";
import { Bikecounter } from 'src/app/actual-situation/shared/bikecounter';
import curl from 'curl-request';
import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserLocality } from 'src/app/actual-situation/shared/user-Locality';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
    Plugins,
    PushNotification,
    PushNotificationToken,
    PushNotificationActionPerformed
} from '@capacitor/core';


@Injectable()
export class MessagingService {

    currentMessage = new BehaviorSubject(null);
    // messaging = firebase.messaging();
    url = 'https://fcm.googleapis.com/fcm/send';

    PushNotifications = Plugins.PushNotifications;

    constructor(
        private angularFireDB: AngularFireDatabase,
        private angularFireAuth: AngularFireAuth,
        public translate: TranslateService,
        private angularFireMessaging: AngularFireMessaging,
        public afs: AngularFirestore,
        private http: HttpClient) {
        this.angularFireMessaging.messaging.subscribe(
            (_messaging) => {
                _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            }
        )
    }

    /**
     * update token in firebase database
     *
     * @param userId userId as a key
     * @param token token as a value
     */
    updateToken(userId, token) {
        // we can change this function to request our backend service
        this.angularFireAuth.authState.pipe(take(1)).subscribe(
            () => {

                //data[userId] = token;
                this.afs.collection('/fcmTokens').doc(userId).set({
                    dbToken: token
                });
                // this.angularFireDB.object('fcmTokens/').update(data);
                localStorage.setItem(AppSettings.dbToken, token);
            })
    }

    /**
     * request permission for notification from firebase cloud messaging
     *
     * @param userId userId
     */
    requestPermission(userId) {
        if (AppSettings.device === 'web') {
            this.angularFireMessaging.requestToken.subscribe(
                (token) => {
                    console.log(token);
                    this.updateToken(userId, token);
                },
                (err) => {
                    console.error('Unable to get permission to notify.', err);
                }
            );
        }

        if (AppSettings.device === 'android') {
            this.PushNotifications.register();
            this.PushNotifications.addListener('registration',
                (token: PushNotificationToken) => {
                    console.log('Push registration success, token: ' + token.value);
                    this.updateToken(userId, token.value);
                }
            );
        }
    }

    /**
     * hook method when new notification received in foreground
     */
    receiveMessage() {
        if (AppSettings.device === 'web') {
            this.angularFireMessaging.messages.subscribe(
                (payload) => {
                    console.log("new message received. ", payload);
                    //TODO: vyskakovací panel - snackbar?
                    this.currentMessage.next(payload);
                });
        }

        if (AppSettings.device === 'android') {
            this.PushNotifications.addListener('pushNotificationReceived',
                (notification: PushNotification) => {
                    console.log('Push received: ' + JSON.stringify(notification));
                    this.currentMessage.next(notification);
                }
            );
        }
    }

    sendMessage(locality: Bikecounter, senderUid: string, senderAlias: string, comment: string) {
        return new Promise<any>((resolve, reject) => {
            this.getArrayOfReceiversTokens(locality, senderUid).then(receiversTokens => {
                receiversTokens.forEach(receiverToken => {
                    this.prepareCurlRequest(receiverToken, comment, senderAlias, locality);
                    resolve();
                });
            })
                .catch(err => reject())
        });
    }

    prepareCurlRequest(receiverToken: string, comment, senderAlias, locality: Bikecounter) {
        const body = {
            notification: {
                title: this.translate.instant('LOCALITY.USER') + senderAlias + this.translate.instant('LOCALITY.ADDED_COMMENT') + locality.desc,
                body: comment
            },
            to: receiverToken
        };
        const headers = new HttpHeaders()
            .set('Authorization', 'key=' + AppSettings.serverKey)
            .set('content-type', 'application/json');
        return this.http
            .post(this.url, body, { headers })
            .subscribe(res => console.log(res));
    }

    loadAllUserWithFavLocNotSender(localityId: string) {
        return this.afs.collection('/usersFavoriteLocation', ref => ref
            .where('location', '==', localityId))
            .snapshotChanges();
    }

    getArrayOfReceiversTokens(locality: Bikecounter, senderUid): Promise<string[]> {
        const tokens: string[] = [];
        return new Promise<any>((resolve, reject) => {
            this.getArrayOfReceiversUids(locality.bikecounter, senderUid)
                .then(uids => {
                    uids.forEach((uid, i) => {
                        this.loadUserdbToken(uid).subscribe(res => {
                            if (res.data()) {
                                tokens.push(res.data().dbToken);
                            }
                            if (i + 1 === uids.length) {
                                resolve(tokens);
                            }
                        });

                    });
                })
        });
    }

    getArrayOfReceiversUids(localityId: string, senderUid: string): Promise<string[]> {
        const users: string[] = []

        return new Promise<any>((resolve, reject) => {
            this.loadAllUserWithFavLocNotSender(localityId).subscribe(result => {
                if (result.length === 0) {
                    reject(users);
                } else {
                    result.map((r, i) => {
                        const res = r.payload.doc.data() as UserLocality;

                        if (res.uid !== senderUid) {
                            users.push(res.uid);
                        }

                        if (result.length === i + 1) {
                            resolve(users);
                        }
                    });
                }
            })
        });
    }

    loadUserdbToken(userId) {
        return this.afs.collection('fcmTokens').doc(userId).get();
    }

    deleteAllComments() {
        this.afs.collection('comments').snapshotChanges().subscribe(res => {
            res.map(r => this.afs.collection('comments').doc(r.payload.doc.id).delete())
        })
    }

}
