import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from '../../app-settings';

@Component({
    selector: 'app-setting-language-dialog',
    templateUrl: './setting-language-dialog.component.html',
    styleUrls: ['./setting-language-dialog.component.css']
})

export class SettingLanguageDialogComponent implements OnInit {

    languages: string[];
    language: string;

    constructor(public dialogRef: MatDialogRef<SettingLanguageDialogComponent>, private translate: TranslateService) { }

    ngOnInit() {
        this.languages = AppSettings.translate.languages;
        this.language = this.translate.getDefaultLang();
    }

    changeLanguage(): void {
        this.dialogRef.close(this.language);
    }

}
