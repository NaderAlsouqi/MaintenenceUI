import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AddNewFaultComponent } from 'app/add-new-fault/add-new-fault.component';
import { EditFaultComponent } from 'app/edit-fault/edit-fault.component';
import { ReportService } from 'app/services/Reportservice';
import { FaultService } from 'app/services/fault.service';
import { ViewFaultComponent } from 'app/view-fault/view-fault.component';

@Component({
  selector: 'app-fault',
  templateUrl: './fault.component.html',
  styleUrls: ['./fault.component.scss']
})
export class FaultComponent implements OnInit {
  @ViewChild('faultDeleteDialog') faultDeleteDialog! :TemplateRef<any>

 

  
  //displayedColumns: string[] = ['faultsID','faultCode','faultName',,'faultNameAr','action'];
  displayedColumns: string[] = ['faultsNumber','faultCode','faultNameAr','faultName','action']
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 

 constructor(
  public fault:FaultService,
  public report:ReportService,
  private dialog : MatDialog,
  private titleService: Title
  ) { }

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('تعريف الاعطال');

    this.getAllFault();
    this.dataUpdated();
  
  }


  getAllFault() {
    debugger;
    this.fault.getAllFault().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  dataUpdated() {
    this.fault.dataUpdated$.subscribe(() => {
      this.getAllFault();
    });
  }




  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.faultDeleteDialog);
    
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.fault.deleteFault(id).subscribe(() => {
          }
          );
        } else {
        }
      }
    });
  }
  
  
  openDialog(){
    debugger;
  const dialogRef =
  this.dialog.open(AddNewFaultComponent,{
   width:'40%'
   

  });
  dialogRef.afterClosed().subscribe(() => {
    // Handle dialog close event if needed
    this.getAllFault();
  });
  }

 
  OpenEditFaultDialog(fault: any) {
    const dialogRef = this.dialog.open(EditFaultComponent, {
      width: '40%',
      data: fault,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAllFault();
    });
  }



  viewFault(fault: any): void {
    const dialogRef = this.dialog.open(ViewFaultComponent, {
      width: '40%',
      data: fault,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      
    });
  }



  DownloadInvoice() {
    this.report.GeneratePdf_Faults().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'GeneratePdf_Faults.pdf';
  
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
    this.report.GeneratePdf_Faults().subscribe((response: any) => {
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