import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from 'common-components';

@Component({
  selector: 'app-ini-dialog',
  templateUrl: './ini-dialog.component.html',
  styleUrls: ['./ini-dialog.component.css']
})
export class IniDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<IniDialogComponent>) { }

  ngOnInit() {
  }

}
