import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AddOpposedComponent } from 'app/add-opposed/add-opposed.component';
import { EditOpposedComponent } from 'app/edit-opposed/edit-opposed.component';
import { ReportService } from 'app/services/Reportservice';
import { OpposedService } from 'app/services/opposed.service';
import { ViewOpposedComponent } from 'app/view-opposed/view-opposed.component';

@Component({
  selector: 'app-opposed',
  templateUrl: './opposed.component.html',
  styleUrls: ['./opposed.component.scss']
})
export class OpposedComponent implements OnInit {
  @ViewChild('opposedDeleteDialog') opposedDeleteDialog!: TemplateRef<any>;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['exhibitionIDNmAr', 'mobile1', 'mobile2', 'address', 'exhib', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>; // Initialize

  constructor(
    public opposed: OpposedService, 
    public report: ReportService, 
    private dialog: MatDialog,
    private titleService: Title
    ) { }

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('المعارض');

    this.getAllExhibition();
    this.dataUpdated();

  }
  dataUpdated() {
    this.opposed.dataUpdated$.subscribe(() => {
      this.getAllExhibition();
    });
  }


  getAllExhibition() {
    this.opposed.getAllExhibition().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  @ViewChild('AddDialog') AddDialog!: TemplateRef<any>;
 


  OpenDialog() {
    const dialogRef =  this.dialog.open(AddOpposedComponent, {
      width: '40%'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllExhibition(); // Handle dialog close event if needed
    });
  
  }

  viewOpposed(customer: any): void {
    const dialogRef = this.dialog.open(ViewOpposedComponent, {
      width: '40%',
      data: customer,
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.opposedDeleteDialog);
    
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.opposed.deleteOpposed(id).subscribe(() => {
          
          }
          );
        } else {
        }
      }
    });
  }
  OpenEditDialog(opposed: any) : void {
    const dialogRef = this.dialog.open(EditOpposedComponent, {
      width: '40%',
      data: opposed,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllExhibition(); // Handle dialog close event if needed
     });
   }
  
  DownloadInvoice() {
    this.report.GeneratePdf_Exhibition().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'GeneratePdf_Exhibition.pdf';
  
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
    this.report.GeneratePdf_Exhibition().subscribe((response: any) => {
      const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource; // Assign the data source to the table
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
