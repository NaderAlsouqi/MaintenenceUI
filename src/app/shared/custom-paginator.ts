import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    constructor() {
        super();
        this.translateLabels();
    }

    translateLabels() {
        this.itemsPerPageLabel = 'العناصر في الصفحة:';
        this.nextPageLabel = 'الصفحة التالية';
        this.previousPageLabel = 'الصفحة السابقة';
        this.firstPageLabel = 'الصفحة الأولى';
        this.lastPageLabel = 'الصفحة الأخيرة';
    }

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 من ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex =
            startIndex < length
                ? Math.min(startIndex + pageSize, length)
                : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} من ${length}`;
    };
}
