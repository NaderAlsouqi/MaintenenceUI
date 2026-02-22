import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AddRepresentativeComponent } from 'app/add-representative/add-representative.component';
import { EditRepresentativeComponent } from 'app/edit-representative/edit-representative.component';
import { ReportService } from 'app/services/Reportservice';
import { RepresentativeService } from 'app/services/representative.service';
import { ViewRepresentativeComponent } from 'app/view-representative/view-representative.component';


@Component({
  selector: 'app-representative',
  templateUrl: './representative.component.html',
  styleUrls: ['./representative.component.scss']
})
export class RepresentativeComponent implements OnInit {
  @ViewChild('DeviceDeleteDialog') DeviceDeleteDialog! :TemplateRef<any>


  displayedColumns: string[] = [/*'id',*/'deviceType','deviceSR','customers_FName','customersNum','deviceID','action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();


 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public device:RepresentativeService,
    public report:ReportService,
    private dialog : MatDialog,
    private titleService: Title
    ) { }
  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('المندوبين');


    this.GetDevice();
    this.dataUpdated();
  }
  @ViewChild('AddDialog') AddDialog!:TemplateRef<any>;

  dataUpdated() {
    this.device.dataUpdated$.subscribe(() => {
      this.GetDevice();
    });
  }

  GetDevice() {
    this.device.GetDevice().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  
  OpenEditRepresentativeDialog(representative: any) : void {
    const dialogRef = this.dialog.open(EditRepresentativeComponent, {
      width: '40%',
      data: representative,
    });

   
    dialogRef.afterClosed().subscribe(() => {
      this.GetDevice(); // Handle dialog close event if needed
    });
    
    }  
  viewRepresentative(technical: any): void {
    const dialogRef = this.dialog.open(ViewRepresentativeComponent, {
      width: '40%',
      data: technical,
    });

    dialogRef.afterClosed().subscribe(() => {
    });
    
    }  
 



    openDeleteDialog(id: any) {
      const dialogRef = this.dialog.open(this.DeviceDeleteDialog);
      
      dialogRef.afterClosed().subscribe((res) => {
        if (res !== undefined) {
          if (res === 'yes') {
            this.device.deleteDevice(id).subscribe(() => {
            
            }
            );
          } else {
          }
        }
      });
    }
  

OpenDialog()
{
  const dialogRef = this.dialog.open(AddRepresentativeComponent,{
  width:'40%'
})
dialogRef.afterClosed().subscribe(() => {
  this.GetDevice(); // Handle dialog close event if needed
});

}

  
DownloadInvoice() {
  this.report.GeneratePdf_Device().subscribe(
    (res: any) => {
      const contentDispositionHeader = res.headers.get('content-disposition');
      const fileName = contentDispositionHeader
        ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
        : 'GeneratePdf_Device.pdf';

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
  this.report.GeneratePdf_Device().subscribe((response: any) => {
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


