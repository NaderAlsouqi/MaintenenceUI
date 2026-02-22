import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ReportService } from 'app/services/Reportservice';
import { BillsService } from 'app/services/bills.service';
import { MaintenanceManagerService } from 'app/services/maintenance-manager.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-view-bill-maintenanc',
  templateUrl: './view-bill-maintenanc.component.html',
  styleUrls: ['./view-bill-maintenanc.component.scss']
})

export class ViewBillMaintenancComponent implements OnInit {
  selectedId: number | undefined;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['maintenanceID','end_Date','Request_statues','tot','dis','tot_bill','action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  UserList: any[] = [];
  UserFilteredOptions: Observable<any[]>;
  billlForm!: FormGroup;
  searchedData:any[];
  date22:any;
 

  @ViewChild('UserIdInput') UserIdInput!: ElementRef<HTMLInputElement>;
  constructor(
    public bill:BillsService,
    private dialog : MatDialog,
    private report:ReportService,
    private toster:ToastrService,
    public Users: MaintenanceManagerService,
    private fb:FormBuilder,
    private titleService: Title) { }

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('استعراض سند قبض');

    this.GetBillStatus();




     //User Code For Filtering And Retrieving the data.
     this.Users.getTechnicals().subscribe((response: any) => {
      this.UserList = response;
  
      this.UserFilteredOptions = this.billlForm.get('UserNmAr').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._userFilter(value))
      );
  
      const userControl = this.billlForm.get('UserNmAr');
  
      userControl.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.UserList.find(option => option.userNmAr === value);
        if (!matchingOption && value !== '') {
          userControl.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
  
      this.UserIdInput.nativeElement.addEventListener('focusout', () => {
        const value = userControl.value;
        const matchingOption = this.UserList.find(option => option.userNmAr === value);
        if (!matchingOption && value.trim() !== '') {
          userControl.setValue(''); // Clear the input field
          if (!this.UserList.some(option => option.userNmAr.includes(value))){
            this.toster.warning('القيمة التي تم إدخالها لـ "اسم الفني" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
          }
        }
      });
    });
  

    this.billlForm = this.fb.group({
      date1: [null,],
      date2: [null,],
      UserNmAr: [null,],
     
    });



  }
  
  searchBill() {
 

    this.Users.searchBill(this.billlForm.value).subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;
    });
  }
  onSearch(){
    this.searchBill();

  }


   // The User Filtering Method
   private _userFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.UserList.filter(option => option.userNmAr.toLowerCase().includes(filterValue));
  }
   //Setting the name and id of the user to the FormControl
   selectUser(option: any) {
    const selectedUser = option; // Assign the selected option name to the variable
    this.billlForm.get('UserNmAr').setValue(selectedUser.userNmAr);
    //this.AddWarehouseForm.get('UserNmAr').setValue(selectedUser.userNmAr);
  }

  GetBillStatus() {
    this.bill.getBillStatus().subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;

    });
  }

  rowClicked(row: any) {
    this.selectedId = row.intro_id;
    this.PrintInvoiceById();
  }
  
  DownloadInvoice() {
    this.report.BillStatusPdf().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'BillStatusPdf.pdf';

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
    this.report.BillStatusPdf().subscribe((response: any) => {
      const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
    });
  }

  PrintInvoiceById() {
    if (this.selectedId !== undefined) {
      this.report.ViewBillStatusPdf(this.selectedId).subscribe((response: any) => {
        const blobResponse: Blob = response.body as Blob;
        const url = window.URL.createObjectURL(blobResponse);
        window.open(url);
      });
    } else {
      // إشعار بأنه يجب تحديد صف من الجدول قبل النقر على "عرض الفاتورة"
      // يمكنك استخدام أداة إشعار مثل MatSnackBar لعرض إشعار للمستخدم
    }
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
