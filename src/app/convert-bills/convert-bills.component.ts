import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ReportService } from 'app/services/Reportservice';
import { BillsService } from 'app/services/bills.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';


@Component({
  selector: 'app-convert-bills',
  templateUrl: './convert-bills.component.html',
  styleUrls: ['./convert-bills.component.scss']
})
export class ConvertBillsComponent implements OnInit {
  billlForm!: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select','intro_id', 'billId', 'billDate', 'discount', 'workers', 'taxes', 'total', 'customerName', 'customersNo', 'customerAccNo', 'status'];

  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public bill:BillsService,
    private report:ReportService,
    private titleService: Title,
    private fb:FormBuilder,
    private toastr:ToastrService
    ) { }

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('تحويل سندات القبض');

    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    this.billlForm = this.fb.group({
      date1: [startOfMonth],
      date2: [endOfMonth],
      status: ['لم يتم التحويل']
    });

    this.loadBillDetails();

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  getSelectedRows() {
    const selectedRows = this.selection.selected;
    // Do something with the selected rows
    console.log(selectedRows);
  }

  loadBillDetails() {
    let fromDate = this.billlForm.get('date1').value;
    let toDate = this.billlForm.get('date2').value;

    // Format the dates to 'YYYY-MM-DD'
    fromDate = moment(fromDate).format('YYYY-MM-DD');
    toDate = moment(toDate).format('YYYY-MM-DD');

    const statusName = this.billlForm.get('status').value;

    this.bill.getBillDetails(fromDate, toDate, statusName).subscribe(
      data => {
        this.dataSource.data = data;
      },
      error => {
        this.toastr.error('لم يقم بارجاع البيانات')
      }
    );
  }
  
  onSearch(){
    this.loadBillDetails();
  }

  // In your component class

updateSelectedBillsStatus() {
  const selectedBillIds = this.selection.selected.map(bill => bill.billId);

  if (selectedBillIds.length === 0) {
    this.toastr.warning('لم يتم تحديد أي سندات');
    return;
  }

  this.bill.billUpdateStatus(selectedBillIds, 'تم التحويل').subscribe(
    () => {
      this.toastr.success('تم تحديث حالة السندات بنجاح');
      this.loadBillDetails(); // Reload the bill details to reflect the changes
    },
    error => {
      this.toastr.error('لم يتم تحديث حالة السندات');
      console.error('Error updating bill status:', error);
    }
  );
}


  DownloadInvoice() {
    this.report.BillPdf().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'BillPdf.pdf';

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
  this.report.BillPdf().subscribe((response: any) => {
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
