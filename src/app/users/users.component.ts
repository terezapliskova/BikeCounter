import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSort, MatPaginator, MatTable } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UsersService } from './shared/users.service';
import { CommonComponent } from '../common/common.component';
import { LocalAuthService } from '../auth/shared/local-auth.service';
import { Role } from '../auth/shared/role.enum';
import { ToolbarComponent, DialogTypes, DialogType, DialogData, DialogButtons, DialogComponent, DialogResult } from 'common-components';
import { User } from './shared/user';
import { AppSettings } from '../app-settings';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { UserPasswordDialogComponent } from './user-password-dialog/user-password-dialog.component';
import { BikecounterService } from '../actual-situation/shared/bikecounter.service';
import { FirebaseAuthService } from '../auth/shared/firebase-auth.service';
import { UsersFirebaseService } from './shared/users-firebase.service';
import { AuthDialogComponent } from '../auth/auth-dialog/auth-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { StatisticsService } from '../localities/shared/statistics.service';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent extends CommonComponent implements OnInit, AfterViewInit {

    @ViewChild('toolbar') toolbar: ToolbarComponent;
    @ViewChild('tableUsers') tableUser: MatTable<User>;
    private paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.users.paginator = this.paginator;
    }

    displayedColumns = ['email', 'role', 'menu'];

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public usersService: UsersService,
        protected auth: LocalAuthService,
        public firebaseService: FirebaseAuthService,
        public bikeCounterService: BikecounterService,
        public usersFirebaseService: UsersFirebaseService,
        public firebaseAuthService: FirebaseAuthService,
        public staticsService: StatisticsService
    ) { super(dialog, translate, snackBar, router, usersService, auth, bikeCounterService, firebaseService, staticsService) }

    ngOnInit() {
        this.initAuthData();
        this.getUsers();
    }

    getUsers() {
        this.toolbar.showProgressBar = true;
        this.usersFirebaseService.getUsers().then(users => {
            console.log(users);
            this.users.data = users;
            this.tableUser.renderRows();
            this.toolbar.showProgressBar = false;
        });
    }

    ngAfterViewInit() {
        this.users.sort = this.sort;
    }

    private getUserIndex(id: string): number {
        return this.users.data.findIndex(user => {
            return user.uid === id;
        });
    }

    private getUser(index: number): User {
        return this.users.data[index];
    }

    private getEmail(index: number): string {
        return this.getUser(index).email;
    }

    showEditDialog(user: User) {
        const dialogRef = this.dialog.open(
            UserDialogComponent, {
                width: AppSettings.defaultDialogWidth,
                data: {
                    dialogType: DialogTypes.Edit,
                    user: new User(user),


                }
            }
        );
        dialogRef.afterClosed()
            .subscribe((data: any) => {
                if (data !== null && data !== undefined && data.user !== undefined) {
                    this.editUserInTable(data.user, 'USERS.EDITED', 'USERS.NOT_EDITED');
                }
            });
    }

    protected editUserInTable(user: User, edited: string, notEdited: string) {
        this.toolbar.showProgressBar = true;
        this.usersFirebaseService.editUser(user)
            .then(result => {
                this.users.filteredData[this.getUserIndex(user.uid)] = new User(result);
                this.getUsers();
                this.tableUser.renderRows();
                this.toolbar.showProgressBar = false;
                this.openSnackBar(edited);
            })
            .catch((error) => {
                this.toolbar.showProgressBar = false;
                if (error.status !== 401) {
                    this.openSnackBar(notEdited);
                }
            });
    }

    showDeleteDialog(user: User) {
        const index = this.getUserIndex(user.uid);
        const dialogData: DialogData = {
            dialogType: DialogType.Confirm,
            translate: this.translate,
            title: 'USERS.DELETE',
            message: this.translate.instant('USERS.DELETE_CONFIRMATION').replace('%USER%', this.getEmail(index)),
            buttons: DialogButtons.YesNo
        };
        const dialogRef = this.dialog.open(
            DialogComponent,
            { width: AppSettings.defaultDialogWidth, data: dialogData }
        );
        dialogRef.afterClosed()
            .subscribe((result: DialogResult) => {
                if (result === DialogResult.Yes) {
                    this.deleteUser(user);
                }
            });
    }

    private deleteUser(user: User) {
        const index = this.getUserIndex(user.uid);
        this.toolbar.showProgressBar = true;
        this.usersFirebaseService.deleteUser(user)
            .then(() => {
                this.users.data.splice(index, 1);
                this.getUsers();
                this.tableUser.renderRows();
                this.users.paginator = this.paginator;
                this.paginator._changePageSize(this.paginator.pageSize);
                this.toolbar.showProgressBar = false;
                this.openSnackBar('USERS.DELETED');
            })
            .catch((error) => {
                this.toolbar.showProgressBar = false;
                if (error.status !== 401) {
                    this.openSnackBar('USERS.NOT_DELETED');
                }
            });
    }



    showNewDialog(){
        const dialogRef = this.dialog.open(
            AddUserDialogComponent, {
                width: AppSettings.defaultDialogWidth,
                data: {
                    dialogType: DialogTypes.Add,
                    user: new User()
                }
            }
        );
        dialogRef.afterClosed()
        .subscribe((data: any) => {
            if (data !== null && data !== undefined ) {
                console.log(data);
                this.addUser(data.user);
            }
        });
    }

    addUser(user: User){
        console.log(user);
        this.firebaseAuthService.register(user.email, user.password, false, user.role).then((us)=>{
            user.uid = us.user.uid;
            this.users.filteredData.push(new User(user));
            this.getUsers();
            this.tableUser.renderRows();
            this.openSnackBar('USERS.ADDED');
        })
    }
}
