import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogTypes } from 'common-components';
import * as ini from 'ini';
import * as fs from 'fs';

@Component({
    selector: 'app-add-sensor-dialog',
    templateUrl: './add-sensor-dialog.component.html',
    styleUrls: ['./add-sensor-dialog.component.css']
})
export class AddSensorDialogComponent implements OnInit {

    showAddBtn = false;
    showEditBtn = false;
    color = 'primary';
    type: DialogTypes = DialogTypes.Add;
    fileName = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddSensorDialogComponent>,
    ) { }

    ngOnInit() {
        this.setDialogType();
        this.setDialogButtons();
    }

    private setDialogType() {
        if (this.data.dialogType !== undefined) {
            this.type = this.data.dialogType;
        }
    }

    fileInputChanged(e: any) {
        if (e.srcElement.files[0] !== undefined) {
            const reader = new FileReader();
            reader.readAsText(e.srcElement.files[0], 'Windows-1250');
            const that = this;
            reader.onload = () => {
                that.data.bikecounter.config = reader.result;
            };
            this.fileName = e.srcElement.files[0].name;

        } else {
            this.fileName = 'APP.NO_SELECTED';
        }
    }

    private setDialogButtons() {
        switch (this.type) {
            case DialogTypes.Add:
                this.showAddBtn = true;
                break;
            case DialogTypes.Edit:
                this.showEditBtn = true;
                break;
        }
    }

    BCExist(name): boolean {
        const bc = this.data.bcIds.find(b => {
            return b === name;
        });

        if (bc && !this.showEditBtn) {
            return true;
        } else { return false; }
    }

}
