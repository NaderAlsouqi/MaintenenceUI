import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomersComponent } from 'app/add-customers/add-customers.component';
import { Router } from '@angular/router';
import { CustomersService } from '../services/customers.service';
import { EditCustomersComponent } from 'app/edit-customers/edit-customers.component';
import { ViewCustomerDialogComponent } from 'app/view-customer-dialog/view-customer-dialog.component';
import { ReportService } from 'app/services/Reportservice';
import { Title } from '@angular/platform-browser';




@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],

})
export class CustomersComponent implements OnInit {

  @ViewChild('customerDeleteDialog') customerDeleteDialog!: TemplateRef<any>;
  displayedColumns: string[] = ['customersNum', 'customers_FName', 'customers_Address', 'customers_Status', 'Location_Coordinates', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('popupview') popupview!: ElementRef;
  pdfurl: string = '';

  constructor(
    public customer: CustomersService,
    public report: ReportService,
    private dialog: MatDialog,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    debugger;
    // to change the tab Title name .
    this.titleService.setTitle('العملاء');


    this.getAlluser();
    this.dataUpdated();

  }

  getAlluser() {
    this.customer.getAlluser().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  dataUpdated() {
    this.customer.dataUpdated$.subscribe(() => {
      this.getAlluser();
    });
  }




  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.customerDeleteDialog);

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.customer.deleteCustomer(id).subscribe(() => {

          }
          );
        } else {
        }
      }
    });
  }




  OpenAddCustomerDialog() {
    const dialogRef = this.dialog.open(AddCustomersComponent, {
      width: '60%',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAlluser();
    });
  }

  OpenEditCustomerDialog(customer: any): void {
    const dialogRef = this.dialog.open(EditCustomersComponent, {
      width: '60%',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: customer,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAlluser();
    });
  }


  viewCustomer(customer: any): void {
    const dialogRef = this.dialog.open(ViewCustomerDialogComponent, {
      width: '45%',
      data: customer,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
    });
  }



  DownloadInvoice() {
    this.report.GeneratePdf_customer().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'GeneratePdf_customer.pdf';

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
    this.report.GeneratePdf_customer().subscribe((response: any) => {
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



