import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Bikecounter } from 'src/app/actual-situation/shared/bikecounter';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-bike-list',
    templateUrl: './bike-list.component.html',
    styleUrls: ['./bike-list.component.scss']
})
export class BikeListComponent implements OnInit {

    private paginator: MatPaginator;
    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.data.paginator = this.paginator;
    }

    data: MatTableDataSource<Bikecounter> = new MatTableDataSource<Bikecounter>();
    showInfo = false;

    @Input() bikecounters: Bikecounter[];
    displayedColumns = ['bikecounter', 'menu'];

    @Output() bikeSelected: EventEmitter<string> = new EventEmitter<string>();
    selected: Bikecounter;

    constructor() { }

    select(bc: Bikecounter) {
        this.selected = bc;
        this.bikeSelected.emit(bc.bikecounter);
        this.showInfo = true;
    }

    setSelected(bc: string) {
        this.selected = this.bikecounters.find(b => {
            return b.bikecounter === bc;
        });
        this.showInfo = true;
    }

    ngOnInit() {
        this.data.data = this.bikecounters;
    }

}
