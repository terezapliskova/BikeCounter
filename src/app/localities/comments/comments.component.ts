import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToolbarComponent, PaginatorComponent } from 'common-components';
import { Bikecounter } from 'src/app/actual-situation/shared/bikecounter';
import { BikecounterService } from 'src/app/actual-situation/shared/bikecounter.service';
import { FirebaseAuthService } from 'src/app/auth/shared/firebase-auth.service';
import { LocalAuthService } from 'src/app/auth/shared/local-auth.service';
import { UsersService } from 'src/app/users/shared/users.service';

import { CommentsService } from '../shared/comments.service';
import { StatisticsService } from '../shared/statistics.service';
import { CommonComponent } from '../../common/common.component';
import { Comment } from '../shared/comment';
import * as moment from 'moment';
import { AppSettings } from 'src/app/app-settings';
import { OrderByDirection } from '@google-cloud/firestore';
import { MessagingService } from 'src/app/auth/shared/messaging.service';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent extends CommonComponent implements OnInit {

    @Input() bikecounter: Bikecounter;
    @Input() toolbar: ToolbarComponent;
    comments: Comment[] = [];
    commentsToShow: Comment[] = [];
    commentToAdd: Comment;
    order: OrderByDirection = 'desc';
    @ViewChild('commonPaginator') commonPaginator: PaginatorComponent;
    message;

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public userService: UsersService,
        protected auth: LocalAuthService,
        public bikeCounterService: BikecounterService,
        public firebaseService: FirebaseAuthService,
        public commentsService: CommentsService,
        public staticsService: StatisticsService,
        public messagingService: MessagingService) {
        super(dialog, translate, snackBar, router, userService, auth, bikeCounterService, firebaseService, staticsService)
    }

    ngOnInit() {
        this.prepareCommentToAdd();
        if (!this.isDesktop()) {
            this.loadComments();
        } else {
            this.loadCommentsForPaginator();
        }
    }

    prepareCommentToAdd() {
        this.commentToAdd = new Comment();
        this.commentToAdd.time = moment().format(AppSettings.dateFormatWithSec);
        if (this.auth.getUser()) {
            this.commentToAdd.userAlias = this.auth.getUser().email;
            this.commentToAdd.userUid = this.auth.getUser().uid;
        } else {
            this.commentToAdd.userAlias = this.translate.instant('APP.ANONYM');
            this.commentToAdd.userUid = '0';
        }
        this.commentToAdd.locality = this.bikecounter.bikecounter;
    }

    loadCommentsForPaginator() {
        this.commentsService.getCommentsByLocality(this.bikecounter.bikecounter, this.order)
            .then(c => {
                this.comments = c;
                this.commonPaginator.arrayOfObjects = this.comments;
                this.commonPaginator.goToFirstPage();
            });
    }

    loadComments() {
        this.commentsService.getCommentsByLocality(this.bikecounter.bikecounter, this.order)
            .then(c => {
                this.comments = c;
                this.commentsToShow = this.comments;
                this.commonPaginator.arrayOfObjects = this.comments;
                this.commonPaginator.goToFirstPage();
            });
    }

    addComment() {
        this.commentToAdd.time = moment().format(AppSettings.dateFormatWithSec);
        this.commentsService.addComment(
            this.commentToAdd.locality,
            this.commentToAdd.text,
            this.commentToAdd.userAlias,
            this.commentToAdd.userUid,
            this.commentToAdd.time
        ).then(res => {
            this.loadComments()
            this.messagingService.sendMessage(
                this.bikecounter,
                this.commentToAdd.userAlias,
                this.commentToAdd.userAlias,
                this.commentToAdd.text)
                .then(() => {
                    this.openSnackBar('LOCALITY.COMMENT_ADDED');
                    this.commentToAdd.text = '';
                });
        });
    }

    sort(by: OrderByDirection) {
        this.order = by;
        this.loadComments();
    }

    setCommentsToShow(comments) {
        this.commentsToShow = comments;
    }

}
