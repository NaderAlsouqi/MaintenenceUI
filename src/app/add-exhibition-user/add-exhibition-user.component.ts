import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExhibitionUserService } from 'app/services/exhibition-user.service';

@Component({
  selector: 'app-add-exhibition-user',
  templateUrl: './add-exhibition-user.component.html',
  styleUrls: ['./add-exhibition-user.component.scss']
})
export class AddExhibitionUserComponent implements OnInit {
  @ViewChild('ExhibitionDeleteDialog') EaultsDeleteDialog! :TemplateRef<any>

  displayedColumns: string[] = ['exhibitionID','exhibitionIDNmAr','mobile1','mobile2','address','action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();



  @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

 constructor(public exhibitionUser:ExhibitionUserService,private dialog : MatDialog) { }

  ngOnInit(): void {


    this.getAllexhibition();
  }


  getAllexhibition() {
    this.exhibitionUser.getAllExhibitionUser().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.EaultsDeleteDialog);
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.exhibitionUser.deleteUserExhibition(id).subscribe(() => {
            this.exhibitionUser.getAllExhibitionUser().subscribe((data) => {
              this.dataSource.data = data;
            });
          });
        } else if (res === 'no') {
        }
      }
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
