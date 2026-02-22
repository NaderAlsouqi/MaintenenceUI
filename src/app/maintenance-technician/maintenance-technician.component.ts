import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AttachmentUploadDialogComponent } from 'app/attachment-upload-dialog/attachment-upload-dialog.component';
import { MaintenanceDialogComponent } from 'app/maintenance-dialog/maintenance-dialog.component';
import { ReportService } from 'app/services/Reportservice';
import { AuthService } from 'app/services/auth.service';
import { MaintenanceTechnicianService } from 'app/services/maintenance-technician.service';
import { UserService } from 'app/services/user.service';
import { ViewAttachmentsDialogComponent } from 'app/view-attachments-dialog/view-attachments-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Component({
  selector: 'app-maintenance-technician',
  templateUrl: './maintenance-technician.component.html',
  styleUrls: ['./maintenance-technician.component.scss'],
})
export class MaintenanceTechnicianComponent implements OnInit {

  toppingList: string[] = ['الجميع', 'لم يتم العمل عليه', 'لم يتم تحويل الطلب', 'بحاجة الى قطع', 'لاغي', 'لم تتم الصيانة', 'موافقة العميل', 'سحب الجهاز', 'اصدار سند قبض', 'مغلق- المتابعه', 'مغلق -إصدار سند قبض'];
  searchedData: any[];
  request_statues = 0;

  Status: any[] = [
    { 'value': "0", 'name': 'الجميع' },
    { 'value': "0", 'technical': "1", 'name': 'لم يتم العمل عليه' },
    { 'value': "0", 'technical': "0", 'name': 'لم يتم تحويل الطلب' },
    { 'value': "1", 'name': 'بحاجة الى قطع' },
    { 'value': "2", 'name': 'لاغي' },
    // {'value': "3" , 'name': 'تمت الصيانة'},
    { 'value': "4", 'name': 'لم تتم الصيانة' },
    { 'value': "5", 'name': 'موافقة العميل' },
    { 'value': "6", 'name': 'سحب الجهاز' },
    // {'value': "7" , 'name': 'منتهي'},
    { 'value': "8", 'name': 'اصدار سند قبض' },
    { 'value': "9", 'name': 'مغلق- المتابعه' },
    { 'value': "11", 'name': 'مغلق -إصدار سند قبض' }

  ];
  displayedColumns: string[] = ['intro_id', 'intro_date', 'intro_Emergency', 'devicePor', 'Location_Coordinates', 'UserNmAr', 'request_statues', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  tachnicianForm!: FormGroup;
  test: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public technician: MaintenanceTechnicianService,
    public report: ReportService,
    private dialog: MatDialog, private fb: FormBuilder,
    private user: UserService,
    private toster: ToastrService,
    private titleService: Title,
    private auth: AuthService,

  ) { }
  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('فني الصيانة');
    const userId = this.auth.getUserId();

    this.tachnicianForm = this.fb.group({
      date1: [null],
      date2: [null],
      intro_id: [null],
      phone: [null],
      name: [null],
      request_statues: [[this.toppingList[0]]],
    });

    this.GetUserByID(userId);
    console.log(userId + '___________')
  }

  @ViewChild('AddDialog') AddDialog!: TemplateRef<any>;

  getAllMaintIntro_technical_date() {
    // Pass form value
    this.technician.GetAllMaintIntro_technical_date(this.tachnicianForm.value).subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;
    });
  }
  onSearch() {
    this.getAllMaintIntro_technical_date();

  }

  GetUserByID(id: number): any {

    this.user.getUserByID(id).subscribe((data) => {
      const user_level = data[0].user_level;
      if (user_level === 9) {
        this.getAllMaintIntro();
      } else if (user_level === 3) {
        // Use the search method which works well with default form values
        this.getAllMaintIntro_technical_date();
      } else {
        this.toster.warning('الصفحه غير متاحه لهذا المستخدم');

      }
    });


  }



  getAllMaintIntro() {
    this.technician.GetAllMaintIntro().subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;
    });
  }
  GetAllMaintIntroTechnical(technical: number) {
    this.technician.GetAllMaintIntroTechnical(technical).subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;
    });
  }



  onEmergencyStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus === 'الجميع') {
      this.tachnicianForm.controls.Request_statues.setValue("0");
    }
    if (selectedStatus === 'لم يتم تحويل الطلب') {
      this.tachnicianForm.controls.Request_statues.setValue("0");

    }
    if (selectedStatus === 'لم يتم العمل عليه') {
      this.tachnicianForm.controls.Request_statues.setValue("0");
    }
    else if (selectedStatus === 'بحاجة الى قطع') {
      this.tachnicianForm.controls.Request_statues.setValue("1");
    }
    else if (selectedStatus === 'لاغي') {
      this.tachnicianForm.controls.Request_statues.setValue("2");
    }
    //  else if (selectedStatus === 'تمت الصيانة') {
    //   this.tachnicianForm.controls.Request_statues.setValue("3");
    // }
    else if (selectedStatus === 'لم تتم الصيانة') {
      this.tachnicianForm.controls.Request_statues.setValue("4");
    }
    else if (selectedStatus === 'موافقة العميل') {
      this.tachnicianForm.controls.Request_statues.setValue("5");
    }
    else if (selectedStatus === 'سحب الجهاز') {
      this.tachnicianForm.controls.Request_statues.setValue("6");
    }
    //  else if (selectedStatus === 'منتهي') {
    //   this.tachnicianForm.controls.Request_statues.setValue("7");
    // }
    else if (selectedStatus === 'اصدار سند قبض') {
      this.tachnicianForm.controls.Request_statues.setValue("8");
    }
  }

  onEmergencyStatusChange2(technical: any) {
    const selectedStatus = technical;
    console.log(selectedStatus)
    if (selectedStatus === 'لم يتم تحويل الطلب') {
      this.tachnicianForm.controls.technical.setValue("0");

    }
    if (selectedStatus === 'لم يتم العمل عليه') {
      this.tachnicianForm.controls.technical.setValue("1");
    }
  }

  PrintInvoiceIntro(id: number) {
    this.report.MaintenanceIntroByIdPdf(id).subscribe((response: any) => {
      const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
    });
  }

  PrintInvoice(dataList: any) {
    const modifiedDataList = dataList.map(data => {
      return {
        intro_id: data.intro_id,
        intro_date: data.intro_date,
        devicePor: data.devicePor,
        intro_Emergency: data.intro_Emergency,
        customerAddress: data.customerAddress,
        Request_statues: data.request_statues,
        // ... include other properties as needed
      };
    });
    this.report.MaintenanceTechnician(modifiedDataList).subscribe((response: any) => {
      const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
    });
  }

  DownloadInvoice(dataList: any) {
    const modifiedDataList = dataList.map(data => {
      return {
        intro_id: data.intro_id,
        intro_date: data.intro_date,
        devicePor: data.devicePor,
        intro_Emergency: data.intro_Emergency,
        customerAddress: data.customerAddress,
        Request_statues: data.request_statues,


        // ... include other properties as needed
      };
    });
    this.report.MaintenanceTechnician(modifiedDataList).subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'MaintenanceTechnician.pdf';

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
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Open maintenance dialog instead of navigating to page
  openMaintenanceDialog(row: any): void {
    const dialogRef = this.dialog.open(MaintenanceDialogComponent, {
      width: '800px', // Wider width for parts list
      maxHeight: '90vh',
      disableClose: false, // Allow clicking outside to close
      data: {
        intro_id: row.intro_id,
        devicePor: row.devicePor,
        request_statues: row.request_statues,
        // Pass other fields if available in row, otherwise they will be loaded or empty
        general_Desc: row.general_Desc || ''
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the data after successful maintenance
        const userId = this.auth.getUserId();
        this.GetUserByID(userId);
      }
    });
  }
}


