import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { MessagingService } from './auth/shared/messaging.service';
import { LocalAuthService } from './auth/shared/local-auth.service';
declare const Loader: any;

import { registerWebPlugin, Browser } from '@capacitor/core';
//import { FileSharer } from '@byteowls/capacitor-filesharer';
import { Plugins } from '@capacitor/core';
import { AppSettings } from './app-settings';

declare var cordova: any;



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    message;
    device;

    constructor(
        private settings: SettingsService,
        private translate: TranslateService,
        private title: Title,
        private messagingService: MessagingService,
        protected auth: LocalAuthService) { }
    ngOnInit() {
        this.settings.setLanguages();
        this.settings.setDefaultLanguage();
        this.setDevice();        
        this.setTitle();
        Loader.load();
        this.messagingService.requestPermission(this.auth.getUser().uid);
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;


        /*registerWebPlugin(FileSharer);
        Plugins.Browser.addListener('browserFinished', (st)=>{
            console.log(st);
            Browser.close();
        })*/

    }

    private setTitle(): any {
        this.translate.get('APP.TITLE').subscribe((tran: string) => this.title.setTitle(tran));
    }

    setDevice() {
        Plugins.Device.getInfo().then(device => {
            this.device = device.platform;
            AppSettings.device = device.platform;
        });
        //window.open = cordova.InAppBrowser.open;
    }





}
