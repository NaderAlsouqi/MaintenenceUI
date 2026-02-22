import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/services/user.service';
import { ReportService } from 'app/services/Reportservice';
import { AddTechnicianUserDialogComponent } from 'app/add-technician-user-dialog/add-technician-user-dialog.component';
import { EditTechnicianUserDialogComponent } from 'app/edit-technician-user-dialog/edit-technician-user-dialog.component';
import { EditUserComponent } from 'app/edit-user/edit-user.component';
import { ViewUserComponent } from 'app/view-user/view-user.component';

@Component({
    selector: 'app-technicians-definition',
    templateUrl: './technicians-definition.component.html',
    styleUrls: ['./technicians-definition.component.scss']
})
export class TechniciansDefinitionComponent implements OnInit {

    @ViewChild('UserDeleteDialog') UserDeleteDialog!: TemplateRef<any>;

    displayedColumns: string[] = ['userID', 'userNmAr', 'email', 'loginType', 'user_level', 'relation_level', 'transDate', 'name_relation_level', 'name_User_level', 'action'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        public user: UserService,
        private dialog: MatDialog,
        public report: ReportService,
    ) { }

    ngOnInit(): void {
        this.getAllTechnicians();
        this.dataUpdated();
    }

    getAllTechnicians() {
        this.user.getAllUser().subscribe((data) => {
            // Filter for technicians (user_level 3 or name_User_level 'فني')
            // Note: user.service.ts mentions: 'فني': 3
            this.dataSource.data = data.filter((u: any) => u.user_level === 3 || u.name_User_level === 'فني');
        });
    }

    dataUpdated() {
        this.user.dataUpdated$.subscribe(() => {
            this.getAllTechnicians();
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddTechnicianUserDialogComponent, {
            width: '550px',
            maxWidth: '95vw'
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getAllTechnicians();
        });
    }

    OpenEditUser(users: any) {
        const dialogRef = this.dialog.open(EditTechnicianUserDialogComponent, {
            width: '550px',
            maxWidth: '95vw',
            data: users,
        });

        dialogRef.afterClosed().subscribe(() => {
            this.getAllTechnicians();
        });
    }

    openDeleteDialog(id: any) {
        const dialogRef = this.dialog.open(this.UserDeleteDialog);

        dialogRef.afterClosed().subscribe((res) => {
            if (res === 'yes') {
                this.user.deleteUser(id).subscribe(() => { });
            }
        });
    }

    viewUser(user: any): void {
        const dialogRef = this.dialog.open(ViewUserComponent, {
            width: '550px',
            maxWidth: '95vw',
            data: user,
        });
    }

    DownloadInvoice() {
        this.report.GeneratePdf_User().subscribe(
            (res: any) => {
                const contentDispositionHeader = res.headers.get('content-disposition');
                const fileName = contentDispositionHeader
                    ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
                    : 'GeneratePdf_User.pdf';
                const blob = new Blob([res.body], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            },
            (error) => {
                console.error('Error downloading PDF:', error);
            }
        );
    }

    PrintInvoice() {
        this.report.GeneratePdf_User().subscribe((response: any) => {
            const blobResponse: Blob = response.body as Blob;
            const url = window.URL.createObjectURL(blobResponse);
            window.open(url);
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
