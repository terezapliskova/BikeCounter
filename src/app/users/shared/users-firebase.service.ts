import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user';
import { UsersRole } from 'src/app/auth/shared/users-role';


@Injectable({
    providedIn: 'root'
})
export class UsersFirebaseService {

    constructor(
        public afs: AngularFirestore
    ) { }

    getUsers(): Promise<User[]> {
        return new Promise<any>((resolve, reject) => {
            const users: User[] = [];
            this.loadUsers().subscribe(result => {
                if (result.length === 0) {
                    reject(users);
                } else {
                    result.map((r, i) => {
                        users.push(r.payload.doc.data() as User);
                        if (i + 1 === result.length) {
                            resolve(users);
                        }
                    });

                }
            });
        });
    }

    loadUsers() {
        return this.afs.collection('usersRole')
            .snapshotChanges();
    }

    deleteUser(user: User): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getUserByUserUid(user.uid).subscribe(result => {
                if (result.length === 0) {
                    reject();
                } else {
                    result.map(r => {
                        this.afs.collection('/usersRole').doc(r.payload.doc.id).delete();
                        resolve(r.payload.doc.data());
                    });
                }
            });
        });
    }

    editUser(user: User) {
        return new Promise<any>((resolve, reject) => {
            this.getUserByUserUid(user.uid).subscribe(result => {
                if (result.length === 0) {
                    reject();
                } else {
                    result.map(r => {
                        this.afs.collection('/usersRole').doc(r.payload.doc.id).set(
                            {email: user.email,
                            uid: user.uid,
                            role: user.role}
                        );
                        resolve(user);
                    });
                }
            });
        });
    }

    getUserByUserUid(uid: string) {
        return this.afs.collection('/usersRole', ref => ref.where('uid', '==', uid))
            .snapshotChanges();

    }
}
