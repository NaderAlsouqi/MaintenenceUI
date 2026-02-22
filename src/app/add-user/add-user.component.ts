import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddNewUserComponent } from 'app/add-new-user/add-new-user.component';
import { EditUserComponent } from 'app/edit-user/edit-user.component';
import { ReportService } from 'app/services/Reportservice';
import { UserService } from 'app/services/user.service';
import { ViewUserComponent } from 'app/view-user/view-user.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  @ViewChild('UserDeleteDialog') UserDeleteDialog!: TemplateRef<any>

  displayedColumns: string[] = ['userID', 'userNmAr', 'email', 'loginType', 'user_level', 'relation_level', 'transDate', 'name_relation_level', 'name_User_level', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  maxTooltipLength = true || 10; // Adjust the value as per your requirements



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentDate: Date;

  constructor(
    public user: UserService,
    private dialog: MatDialog,
    public report: ReportService,
  ) { }

  ngOnInit(): void {

    this.getAlluser();
    this.dataUpdated();


  }


  getAlluser() {
    this.user.getAllUser().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  dataUpdated() {
    this.user.dataUpdated$.subscribe(() => {
      this.getAlluser();
    });
  }
  openDialog() {
    const dialogRef =
      this.dialog.open(AddNewUserComponent, {
        width: '550px',
        maxWidth: '95vw'

      })
    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAlluser();
    });
  }

  OpenEditUser(users: any) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '550px',
      maxWidth: '95vw',
      data: users,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAlluser();
    });
  }


  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.UserDeleteDialog);

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.user.deleteUser(id).subscribe(() => {

          }
          );
        } else {
        }
      }
    });
  }
  viewUser(user: any): void {
    const dialogRef = this.dialog.open(ViewUserComponent, {
      width: '550px',
      maxWidth: '95vw',
      data: user,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
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