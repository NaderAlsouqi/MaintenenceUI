import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LogService } from 'app/services/log.service'; // Adjust path
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

    displayedColumns: string[] = ['id', 'action', 'userName', 'timestamp', 'details'];
    dataSource = new MatTableDataSource<any>([]);
    filterForm!: FormGroup;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private logService: LogService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            startDate: [null],
            endDate: [null],
            userId: [null]
        });

        this.loadLogs();
    }

    loadLogs() {
        this.spinner.show();
        const { startDate, endDate, userId } = this.filterForm.value;

        this.logService.getLogs(startDate, endDate, userId).subscribe(
            res => {
                this.dataSource.data = res;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.spinner.hide();
            },
            err => {
                console.error(err);
                this.spinner.hide();
                this.toastr.error('فشل تحميل السجلات');
            }
        );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getActionClass(action: string): string {
        if (!action) return 'badge-update';

        const act = action.toLowerCase();
        if (act.includes('add') || act.includes('create') || act.includes('insert') || act.includes('save')) {
            return 'badge-create';
        } else if (act.includes('delete') || act.includes('remove')) {
            return 'badge-delete';
        } else if (act.includes('login') || act.includes('sign in')) {
            return 'badge-login';
        } else if (act.includes('update') || act.includes('edit')) {
            return 'badge-update';
        }
        return 'badge-update';
    }
}
