import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AddTechnicalComponent } from 'app/add-technical/add-technical.component';
import { EditTechnicalComponent } from 'app/edit-technical/edit-technical.component';
import { ReportService } from 'app/services/Reportservice';
import { MaintenanceTechnicianService } from 'app/services/maintenance-technician.service';
import { ViewTechnicalComponent } from 'app/view-technical/view-technical.component';

@Component({
  selector: 'app-technical',
  templateUrl: './technical.component.html',
  styleUrls: ['./technical.component.scss']
})

export class TechnicalComponent implements OnInit {
  @ViewChild('TechnicalDeleteDialog') TechnicalDeleteDialog!: TemplateRef<any>;
  @ViewChild('AddDialog') AddDialog!:TemplateRef<any>;
  displayedColumns: string[] = ['driver_ID', 'num_Driver', 'name_Driver', 'driver_Status', 'address', 'disc' ,'driv','action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public technician: MaintenanceTechnicianService,
    public report: ReportService,
    private dialog: MatDialog,
    private titleService: Title
     ) { }//private toastService: NgToastService

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('الفنيين');


    this.getAlltechnician();
    this.dataUpdated();
  }

  getAlltechnician() {
    this.technician.getAlltechnician().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  dataUpdated() {
    this.technician.dataUpdated$.subscribe(() => {
      this.getAlltechnician();
    });
  }

  OpenDialog()
  {
    const dialogRef =this.dialog.open(AddTechnicalComponent,{
    width:'40%'
  })

  dialogRef.afterClosed().subscribe(() => {
    this.getAlltechnician(); // Handle dialog close event if needed
  });


  }

  OpenEditTechnicalDialog(technical: any) : void {
    const dialogRef = this.dialog.open(EditTechnicalComponent, {
      width: '40%',
      data: technical,
    });

  
    dialogRef.afterClosed().subscribe(() => {
      this.getAlltechnician(); // Handle dialog close event if needed
    });
    
  }

  viewTechnical(representative: any): void {
    const dialogRef = this.dialog.open(ViewTechnicalComponent, {
      width: '40%',
      data: representative,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
    });
  }

  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.TechnicalDeleteDialog);
    
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.technician.deletetechnician(id).subscribe(() => {
          
          }
          );
        } else {
        }
      }
    });
  }
  
  DownloadInvoice() {
    this.report.GeneratePdf_Driver().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'GeneratePdf_Driver.pdf';

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
    this.report.GeneratePdf_Driver().subscribe((response: any) => {
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


