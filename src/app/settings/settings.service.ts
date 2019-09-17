import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from '../app-settings';

@Injectable()
export class SettingsService {

    readonly LANGUAGE = 'language';

    constructor(private translate: TranslateService, private title: Title) { }

    setLanguages() {
        this.translate.addLangs(AppSettings.translate.languages);
    }

    setLanguage(language: string) {
        localStorage.setItem(this.LANGUAGE, language);
        this.translate.setDefaultLang(language);
        this.translate.use(language);
        this.title.setTitle(this.translate.instant('APP.TITLE'));
    }

    setDefaultLanguage() {
        let language: string = AppSettings.translate.defaultLanguage;

        if (localStorage.getItem(this.LANGUAGE) !== null) {
            language = String(localStorage.getItem(this.LANGUAGE));
        } else if (AppSettings.translate.languages.indexOf(this.translate.getBrowserLang()) !== -1) {
            language = this.translate.getBrowserLang();
            localStorage.setItem(this.LANGUAGE, language);
        } else {
            localStorage.setItem(this.LANGUAGE, language);
        }

        this.translate.setDefaultLang(language);
    }

    getLanguage(): string {
        return String(localStorage.getItem(this.LANGUAGE));
    }

    changeLanguage(language: string) {
        this.setLanguage(language);
    }

}
