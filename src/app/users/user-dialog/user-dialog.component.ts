import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogTypes } from 'common-components';
import { Validators, FormControl } from '@angular/forms';
import { User } from '../shared/user';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

    type: DialogTypes = DialogTypes.Add;
    showAddBtn = false;
    showEditBtn = false;
    noEditable = false;
    color = 'primary';
    fullWidth = '100%';
    emailFormControl = new FormControl({ value: '', disabled: this.noEditable }, [
        Validators.required,
        Validators.email,
    ]);

    user: User;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UserDialogComponent>,
    ) { }


    ngOnInit() {
        this.setDialogType();
        this.setDialogButtons();
        this.user = new User(this.data.user);
    }

    private setDialogType() {
        if (this.data.dialogType !== undefined) {
            this.type = this.data.dialogType;
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
            case DialogTypes.Detail:
                this.showEditBtn = false;
                this.noEditable = true;
                this.emailFormControl.disable();
                break;
        }
    }

    getTitle(): string {
        switch (this.type) {
            case DialogTypes.Add:
                return 'USERS.NEW';
            case DialogTypes.Edit:
                return 'USERS.EDIT';
            case DialogTypes.Detail:
                return 'USERS.USER.TITLE';
            default:
                return 'USERS.NEW';
        }
    }

    userExist(email: string): boolean {

        const existingUser = this.data.users.data.find(user => {
            return user.email === email;
        });

        if (existingUser && (this.user.email !== existingUser.email)) {
            return true;
        } else { return false; }

    }

}
