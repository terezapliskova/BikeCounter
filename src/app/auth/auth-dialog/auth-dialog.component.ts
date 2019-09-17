import { Component, OnInit, Input } from '@angular/core';
import { Credentials } from '../shared/credentials';
import { ToolbarComponent } from 'common-components';
import { SettingsService } from 'src/app/settings/settings.service';

import { LocalAuthService } from '../shared/local-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'src/app/app-settings';
import { FormControl, Validators } from '@angular/forms';
import { CommonComponent } from 'src/app/common/common.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/users/shared/users.service';
import { SettingLanguageDialogComponent } from 'src/app/settings/setting-language-dialog/setting-language-dialog.component';
import { User } from 'src/app/users/shared/user';
import { Role } from '../shared/role.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { BikecounterService } from 'src/app/actual-situation/shared/bikecounter.service';
import { FirebaseAuthService } from '../shared/firebase-auth.service';
import { StatisticsService } from 'src/app/localities/shared/statistics.service';
import { MessagingService } from '../shared/messaging.service';

@Component({
    selector: 'app-auth-dialog',
    templateUrl: './auth-dialog.component.html',
    styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent extends CommonComponent implements OnInit {

    @Input() registration: boolean;
    @Input() toolbar: ToolbarComponent;
    showMessage = false;
    message = '';
    credentials: Credentials = new Credentials();
    language;
    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    constructor(
        private settingsService: SettingsService,
        public dialog: MatDialog,
        public translate: TranslateService,
        public snackBar: MatSnackBar,
        public router: Router,
        public usersService: UsersService,
        protected auth: LocalAuthService,
        public bikeCounterService: BikecounterService,
        public firebaseService: FirebaseAuthService,
        public staticsService: StatisticsService,
        public messagingService: MessagingService) {
        super(dialog, translate, snackBar, router, usersService, auth, bikeCounterService, firebaseService, staticsService)
    }


    ngOnInit() {
        this.language = this.settingsService.getLanguage();
    }

    login() {
        this.toolbar.showProgressBar = true;
        this.firebaseService.login(this.credentials.email, this.credentials.password)
            .then(() => {
                this.messagingService.requestPermission(this.auth.getUser().uid);
                this.messagingService.receiveMessage();
                //this.message = this.messagingService.currentMessage;
                this.router.navigateByUrl('/');
                this.toolbar.showProgressBar = false;
            })
            .catch(() => this.badLogin());
    }


    badLogin() {
        this.toolbar.showProgressBar = false;
        this.openSnackBar('AUTH.BAD_LOGIN');
        

    }

    openLanguageDialog(): void {
        const dialogRef = this.dialog.open(SettingLanguageDialogComponent, { width: '250px' });
        dialogRef.afterClosed().subscribe((result: string) => {
            if (result !== undefined) {
                this.changeLanguage(result);
            }
        });
    }

    changeLanguage(language: string): void {
        if (this.language !== language) {
            this.language = language;
            this.settingsService.changeLanguage(language);
        }
    }

    public socialSignIn(socialPlatform: string) {
        this.firebaseService.loginWithSocial(socialPlatform)
            .then(() => {
                this.messagingService.requestPermission(this.auth.getUser().uid);
                this.messagingService.receiveMessage();
                this.router.navigateByUrl('/');
                this.toolbar.showProgressBar = false;
            })
            .catch(() => this.badLogin());
    }

    makeRegistration() {
        this.firebaseService.register(this.credentials.email, this.credentials.password, true, Role.user)
            .then(() => {
                this.openSnackBar('REGISTRATION.REGISTRATION_SUCCES');
                this.router.navigateByUrl('/');
            })
            .catch((err) => {
                if (err) {
                    this.openSnackBar(err);
                } else {
                    this.badRegistration()
                }
            }
            );
    }

    userExist(email: string): boolean {
        const existingUser = this.users.data.find((user) => {
            return user.email === email;
        });
        if (existingUser && this.registration) {
            return true;
        } else { return false; }

    }

    badRegistration() {
        this.openSnackBar('REGISTRATION.BAD_REGISTRATION');
    }


}
