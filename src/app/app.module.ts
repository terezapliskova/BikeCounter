import 'hammerjs';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconRegistry,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorIntl,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonComponentsModule, DialogComponent } from 'common-components';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { environment } from 'src/environments/environment';

import { ActualSituationComponent } from './actual-situation/actual-situation.component';
import { DetailComponent } from './actual-situation/detail/detail.component';
import { FirebaseLocalitiesService } from './actual-situation/shared/firebase-localities.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthDialogComponent } from './auth/auth-dialog/auth-dialog.component';
import { AuthComponent } from './auth/auth.component';
import { LocalAuthService } from './auth/shared/local-auth.service';
import { MessagingService } from './auth/shared/messaging.service';
import { CommonComponent } from './common/common.component';
import { CommentsComponent } from './localities/comments/comments.component';
import { HourOverviewComponent } from './localities/hour-overview/hour-overview.component';
import { LocalitiesComponent } from './localities/localities.component';
import { LocalityDetailComponent } from './localities/locality-detail/locality-detail.component';
import { StatisticsComponent } from './localities/statistics/statistics.component';
import { MainComponent } from './main/main.component';
import { MapDialogComponent } from './map/map-dialog/map-dialog.component';
import { BikeListComponent } from './map/map-overview/bike-list/bike-list.component';
import { MapOverviewComponent } from './map/map-overview/map-overview.component';
import { MapComponent } from './map/map.component';
import { GetBikecounterPipe } from './map/shared/get-bikecounter.pipe';
import { AddSensorDialogComponent } from './sensors-setting/add-sensor-dialog/add-sensor-dialog.component';
import { IniDialogComponent } from './sensors-setting/ini-dialog/ini-dialog.component';
import { SensorsSettingComponent } from './sensors-setting/sensors-setting.component';
import { PaginatorIntl } from './settings/paginator-intl';
import { SettingLanguageDialogComponent } from './settings/setting-language-dialog/setting-language-dialog.component';
import { SettingsService } from './settings/settings.service';
import { AddUserDialogComponent } from './users/add-user-dialog/add-user-dialog.component';
import { UsersFirebaseService } from './users/shared/users-firebase.service';
import { UsersService } from './users/shared/users.service';
import { UserDialogComponent } from './users/user-dialog/user-dialog.component';
import { UserPasswordDialogComponent } from './users/user-password-dialog/user-password-dialog.component';
import { UsersComponent } from './users/users.component';

import { ServiceWorkerModule } from "@angular/service-worker";
import { UserComponent } from './users/user/user.component';
import { LogoutComponent } from './users/logout/logout.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/*export function getAuthServiceConfigs() {
    const config = new AuthServiceConfig(
        [
            {
                id: FacebookLoginProvider.PROVIDER_ID,
                provider: new FacebookLoginProvider('358928981371962')
            },
            {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider('863948058719-u7tghkbg3dqc6ms0mc4ida55gd62mtmu.apps.googleusercontent.com')
            }
        ]
    );
    return config;
}*/

export function PaginatorIntlFactory(translate: TranslateService) {
    const service = new PaginatorIntl();
    service.injectTranslateService(translate);
    return service;
}


@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        AuthComponent,
        CommonComponent,
        AuthDialogComponent,
        UsersComponent,
        SettingLanguageDialogComponent,
        ActualSituationComponent,
        MapComponent,
        MapDialogComponent,
        DetailComponent,
        UserDialogComponent,
        UserPasswordDialogComponent,
        MapOverviewComponent,
        BikeListComponent,
        GetBikecounterPipe,
        LocalitiesComponent,
        LocalityDetailComponent,
        HourOverviewComponent,
        StatisticsComponent,
        AddUserDialogComponent,
        SensorsSettingComponent,
        IniDialogComponent,
        AddSensorDialogComponent,
        CommentsComponent,
        UserComponent,
        LogoutComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatListModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        CommonComponentsModule,
        NgxMaterialTimepickerModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFireModule.initializeApp(environment.firebase, 'BikeCounter'),
       // ServiceWorkerModule.register('firebase-messaging-sw.js', { enabled: environment.production }),
        AngularFirestoreModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

    ],
    providers: [
        SettingsService,
        /*{
            provide: AuthServiceConfig,
            useFactory: getAuthServiceConfigs
        },*/
        LocalAuthService,
        UsersService,
        MessagingService,
        UsersFirebaseService,
        FirebaseLocalitiesService,
        GetBikecounterPipe,
        {
            provide: MatPaginatorIntl,
            useFactory: PaginatorIntlFactory,
            deps: [TranslateService]
        }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        DialogComponent,
        SettingLanguageDialogComponent,
        MapDialogComponent,
        UserDialogComponent,
        UserPasswordDialogComponent,
        AddUserDialogComponent,
        IniDialogComponent,
        AddSensorDialogComponent
    ]
})
export class AppModule {
    constructor(mdIconRegistry: MatIconRegistry) {
        mdIconRegistry.registerFontClassAlias('fa', 'fa');
    }

}
