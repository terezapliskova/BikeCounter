import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PaginatorIntl extends MatPaginatorIntl {

    translate: TranslateService;
    firstPageLabel = 'First page';
    itemsPerPageLabel = 'Items per page';
    lastPageLabel = 'Last page';
    nextPageLabel = 'Next page';
    previousPageLabel = 'Previous page';

    getRangeLabel = function (page, pageSize, length) {
        const of = this.translate ? this.translate.instant('APP.PAGINATOR.OF') : 'of';
        //this.translateLabels();
        if (length === 0 || pageSize === 0) {
            return '0 ' + of + ' ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
    };

    injectTranslateService(translate: TranslateService) {
        this.translate = translate;

        this.translate.onLangChange.subscribe(() => {
            this.translateLabels();
        });

        this.translateLabels();
    }

    translateLabels() {
        this.translate.get('APP.PAGINATOR.FIRST_PAGE').subscribe((tran: string) => this.firstPageLabel = tran);
        this.translate.get('APP.PAGINATOR.ITEMS_PER_PAGE').subscribe((tran: string) => this.itemsPerPageLabel = tran);
        this.translate.get('APP.PAGINATOR.LAST_PAGE').subscribe((tran: string) => this.lastPageLabel = tran);
        this.translate.get('APP.PAGINATOR.NEXT_PAGE').subscribe((tran: string) => this.nextPageLabel = tran);
        this.translate.get('APP.PAGINATOR.PREVIOUS_PAGE').subscribe((tran: string) => this.previousPageLabel = tran);
    }
}
