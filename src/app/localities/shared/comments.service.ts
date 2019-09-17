import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Comment } from './comment';
import { OrderByDirection } from '@google-cloud/firestore';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {

    constructor(
        public afs: AngularFirestore,
    ) { }

    getCommentsByLocality(bc: string, by: OrderByDirection): Promise<Comment[]> {
        const comments: Comment[] = [];
        return new Promise<any>((resolve, reject) => {
            this.loadCommentsByLocality(bc, by).subscribe(result => {
                if (result.length === 0) {
                    reject();
                } else {
                    result.map((r, i) => {
                        const res = r.payload.doc.data() as Comment;
                        comments.push(res);
                        if (result.length === i + 1) {
                            resolve(comments);
                        }
                    });
                }
            })
        })
    }


    loadCommentsByLocality(bc: string, by: OrderByDirection) {
        return this.afs.collection('comments', ref => ref
        .where('locality', '==', bc)
        .orderBy('time', by))
            .snapshotChanges();
    }

    addComment(locality, text, userAlias, userUid, time): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.afs.collection('comments').add({
                locality,
                text,
                userAlias,
                userUid,
                time
            }).then(r => {
                resolve();
            })
                .catch(err => {
                    reject()
                });

        });
    }
}
