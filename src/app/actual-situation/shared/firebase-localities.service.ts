import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserLocality } from './user-Locality';

@Injectable({
    providedIn: 'root'
})
export class FirebaseLocalitiesService {

    constructor(
        public afs: AngularFirestore
    ) { }

    findFavorite(uid: string): Promise<string[]> {
        const fav: string[] = [];
        return new Promise<any>((resolve, reject) => {
            this.loadAllFavoriteLocByUserUid(uid).subscribe(result => {
                if (result.length === 0) {
                    resolve(fav);
                } else {
                    result.map((r, i) => {
                        const res = r.payload.doc.data() as UserLocality;
                        fav.push(res.location);
                        if (result.length === i + 1) {
                            resolve(fav);
                        }
                    });
                }
            });
        });
    }

    addToFavorite(userId: string, bc: string) {
        this.afs.collection('/usersFavoriteLocation').add({
            uid: userId,
            location: bc
        });
    }

    deleteFromFavorite(userId: string, bc: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.loadAllFavoriteLocByUserUidAndLoc(userId, bc).subscribe(result => {
                if (result.length === 0) {
                    reject();
                } else {
                    result.map(r => {
                        this.afs.collection('/usersFavoriteLocation').doc(r.payload.doc.id).delete();
                        resolve(r.payload.doc.data());
                    });
                }
            })
        });
    }


    loadAllFavoriteLocByUserUid(uid) {
        return this.afs.collection('/usersFavoriteLocation', ref => ref.where('uid', '==', uid))
            .snapshotChanges();
    }

    loadAllFavoriteLocByUserUidAndLoc(uid, loc) {
        return this.afs.collection('/usersFavoriteLocation', ref => ref
            .where('uid', '==', uid)
            .where('location', '==', loc)
        )
            .snapshotChanges();
    }

}
