import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AttachmentUploadDialogComponent } from 'app/attachment-upload-dialog/attachment-upload-dialog.component';
import { ReportService } from 'app/services/Reportservice';
import { AreaService } from 'app/services/area.service';
import { CustomersService } from 'app/services/customers.service';
import { MaintenanceManagerService } from 'app/services/maintenance-manager.service';
import { ViewAttachmentsDialogComponent } from 'app/view-attachments-dialog/view-attachments-dialog.component';
import { data } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-maintenance-manager',
  templateUrl: './maintenance-manager.component.html',
  styleUrls: ['./maintenance-manager.component.scss']
})
export class MaintenanceManagerComponent implements OnInit {

  maxTooltipLength = true || 10; // Adjust the value as per your requirements
  AddressList: any[] = [];

  loginTypeOptions: any;

  loginType: any;

  displayedColumns: string[] = [
    'intro_id',
    'intro_date',
    'customers_FName1',
    'devicePor',
    'chooseTechnical',
    'UserNmAr',
    'intro_Emergency',
    'intro_InOut',
    'Customers_Address2',
    'Request_statues',
    'action'
  ];
  model: any;
  searchedData: any[];
  myControl = new FormControl();
  AddressFilteredOptions: Observable<any[]>;
  addressAuto: MatAutocompleteTrigger;
  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  mangerForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public manager: MaintenanceManagerService,
    public report: ReportService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private titleService: Title,
    private toster: ToastrService,
    private customer: CustomersService,
  ) { }
  @ViewChild('AddDialog') AddDialog!: TemplateRef<any>;

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('مدير الصيانة');

    this.customer.GetFault().subscribe((response: any) => {
      this.AddressList = response;

      this.AddressFilteredOptions = this.mangerForm.get('Customers_Address2').valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._addressFilter(value))
      );

      const addressControl = this.mangerForm.get('Customers_Address2');

      addressControl.valueChanges.pipe(
        debounceTime(300)
      ).subscribe(value => {
        const matchingOption = this.AddressList.find(option => option.faultsNmAr === value);
        if (!matchingOption && value !== '') {
          addressControl.markAsTouched();
        }
      });

      this.addressInput.nativeElement.addEventListener('focusout', () => {
        const value = addressControl.value;
        const matchingOption = this.AddressList.find(option => option.faultsNmAr === value);
        if (!matchingOption && value.trim() !== '') {
          addressControl.setValue('');
          if (!this.AddressList.some(option => option.faultsNmAr.includes(value))) {
            this.toster.warning('القيمة التي تم إدخالها لـ "اسم المنطقة" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
          }
        }
      });

      // Update the AddressFilteredOptions with the filtered values
      this.AddressFilteredOptions = this.mangerForm.get('Customers_Address2').valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._addressFilter(value))
      );

    });
    this.openAddressAutocompletePanel(); // Open the autocomplete panel


    this.getAllMaintIntro();
    this.fetchLoginTypeOptions();

    this.mangerForm = this.fb.group({
      date1: [null],
      date2: [null],
      Customers_Address2: [null],


    });

  }



  getStatusTooltip(requestStatus: number): string {
    switch (requestStatus) {
      case 0:
        return ' لم يتم العمل عليه';
      case 1:
        return ' بحاجة الى قطع';
      case 2:
        return ' لاغي';
      case 3:
        return 'تمت الصيانة';
      case 4:
        return 'لم تتم الصيانة';
      case 5:
        return 'موافقة العميل';
      case 6:
        return ' سحب الجهاز';
      case 7:
        return 'منتهي';
      case 8:
        return 'اصدار سند القبض';
      default:
        return '';
    }
  }

  getMaintIntro_bet_date() {
    this.manager.GetMaintIntro_bet_date(this.mangerForm.value).subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;
    });
  }

  onSearch() {
    this.getMaintIntro_bet_date();

  }

  getAllMaintIntro() {
    this.manager.GetAllMaintIntro().subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;
    });
  }

  addUserMaint(intro_id: any, technical_id: any) {
    this.manager.addUserMaint(intro_id, technical_id).subscribe(() => {

    }, error => {
      if (error.status == 200) {
        this.toastr.success('تم التحويل بنجاح');
        this.getAllMaintIntro();
        this.spinner.hide();

      }
      else {
        this.toastr.error("لم يتم التحويل ");
        this.spinner.hide();

      }
    });
  }

  fetchLoginTypeOptions() {
    this.manager.getTechnicals().subscribe((data) => {
      this.loginTypeOptions = data;
    });
  }



  // The Exhibition Filtering Method
  private _addressFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.AddressList.filter(option => option.faultsNmAr.toLowerCase().includes(filterValue));
  }
  openAddressAutocompletePanel() {
    setTimeout(() => {
      if (this.addressAuto) {
        this.addressAuto.openPanel();
      }
    }, 0);
  }
  PrintInvoice(dataList: any) {
    const modifiedDataList = dataList.map(data => {
      return {
        intro_id: data.intro_id,
        intro_date: data.intro_date,
        CustomerName: data.customerName,
        CustomersNum: data.customersNum,
        devicePor: data.devicePor,
        UserNmAr: data.userNmAr,
        intro_Emergency: data.intro_Emergency,
        intro_InOut: data.intro_InOut,
        Request_statues: data.request_statues,
        // ... include other properties as needed
      };
    });
    this.report.MaintenanceManager(modifiedDataList).subscribe((response: any) => {
      const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
    });
  }
  selectType(option: any) {
    const selectedType = option;
    this.mangerForm.get('Customers_Address2').setValue(selectedType.faultsNmAr);

  }
  DownloadInvoice(dataList: any) {
    const modifiedDataList = dataList.map(data => {
      return {
        intro_id: data.intro_id,
        intro_date: data.intro_date,
        CustomerName: data.customerName,
        CustomersNum: data.customersNum,
        devicePor: data.devicePor,
        UserNmAr: data.userNmAr,
        intro_Emergency: data.intro_Emergency,
        intro_InOut: data.intro_InOut,
        Request_statues: data.request_statues,


        // ... include other properties as needed
      };
    });
    this.report.MaintenanceManager(modifiedDataList).subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'MaintenanceManager.pdf';

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

  openAttachmentUploadDialog(intro_id: number): void {
    const dialogRef = this.dialog.open(AttachmentUploadDialogComponent, {
      width: '400px', // Adjust the dialog width as needed
      data: intro_id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle any result or actions after the dialog is closed
      }
    });
  }

  openViewAttachmentsDialog(introId: number): void {
    this.dialog.open(ViewAttachmentsDialogComponent, {
      width: '700px',
      data: { introId: introId }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter predicate to search across multiple fields
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = filter.toLowerCase();

      // Search in multiple fields
      const fieldsToSearch = [
        data.intro_id?.toString() || '',
        data.customers_FName1 || '',
        data.customersNum || '',
        data.devicePor || '',
        data.userNmAr || '',
        data.customers_Address2 || '',
        data.intro_date || ''
      ];

      // Check if any field contains the search string
      return fieldsToSearch.some(field =>
        field.toLowerCase().includes(searchStr)
      );
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Reset to first page when filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // --- Stats Helper Methods ---
  getPendingCount(): number {
    if (!this.dataSource?.filteredData) return 0;
    return this.dataSource.filteredData.filter((row: any) => row.technical === 0 || !row.technical).length;
  }

  getAssignedCount(): number {
    if (!this.dataSource?.filteredData) return 0;
    return this.dataSource.filteredData.filter((row: any) => row.userNmAr).length;
  }

  getEmergencyCount(): number {
    if (!this.dataSource?.filteredData) return 0;
    return this.dataSource.filteredData.filter((row: any) => row.intro_Emergency === 1).length;
  }

  // --- Status Helper Methods ---
  getStatusText(requestStatus: number, technical: number): string {
    if (requestStatus === 0 && technical === 0) return 'لم يتم تحويل الطلب';
    if (requestStatus === 0 && technical !== 0) return 'لم يتم العمل عليه';

    switch (requestStatus) {
      case 1: return 'بحاجة الى قطع';
      case 2: return 'لاغي';
      case 3: return 'تمت الصيانة';
      case 4: return 'لم تتم الصيانة';
      case 5: return 'موافقة العميل';
      case 6: return 'سحب الجهاز';
      case 7: return 'منتهي';
      case 8: return 'اصدار سند القبض';
      case 9: return 'مغلق- المتابعه';
      case 11: return 'مغلق -إصدار سند قبض';
      default: return '';
    }
  }

  getStatusClass(requestStatus: number, technical: number): string {
    if (requestStatus === 0 && technical === 0) return 'not-transferred';
    if (requestStatus === 0 && technical !== 0) return 'pending';

    switch (requestStatus) {
      case 1: return 'in-progress';
      case 2: return 'cancelled';
      case 3: return 'completed';
      case 4: return 'cancelled';
      case 5: return 'in-progress';
      case 6: return 'in-progress';
      case 7: return 'completed';
      case 8: return 'completed';
      case 9: return 'completed';
      case 11: return 'completed';
      default: return '';
    }
  }

}
