import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ReportService } from 'app/services/Reportservice';
import { EnquiryService } from 'app/services/enquiry.service';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {
 // Status: string[] = ["اصدار فاتورة ","منتهي ","سحب الجهاز ","موافقة العميل ","لم تتم الصيانة ","تمت الصيانة"," لاغي", "  بحاجة الى قطع","الجميع"];
 toppingList: string[] = ['الجميع','لم يتم العمل عليه', 'لم يتم تحويل الطلب', 'بحاجة الى قطع', 'لاغي', 'لم تتم الصيانة','موافقة العميل','سحب الجهاز','اصدار سند قبض','مغلق- المتابعه','مغلق -إصدار سند قبض'];

  displayedColumns: string[] = [ 'intro_id','intro_date' ,'devicePor','customerName','end_Date','start_date','follow_maint','request_statues' ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  request_statues=0;
  searchedData:any[];

  Status: any[] = [
    {'value': 0 ,'name': 'الجميع' },
    {'value': 0 , 'technical':1 ,'name':'لم يتم العمل عليه' },
    {'value': 0 , 'technical':0 ,'name':'لم يتم تحويل الطلب'},
    {'value': 1 , 'name': 'بحاجة الى قطع' },
    {'value': 2 , 'name': 'لاغي'},
   // {'value': 3 , 'name': 'تمت الصيانة'},
    {'value': 4 , 'name': 'لم تتم الصيانة'},
    {'value': 5 , 'name': 'موافقة العميل'},
    {'value': 6 , 'name': 'سحب الجهاز'},
    // {'value': 7 , 'name': 'منتهي'},
    {'value': 8 , 'name': 'اصدار سند قبض'},
    {'value': 9 , 'name': 'مغلق- المتابعه'},
    {'value': 11 , 'name': 'مغلق -إصدار سند قبض'}
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;
 enquiryForm!: FormGroup;
  spinner: any;
  toster: any;
  model:any;
  constructor(
    public enquiry:EnquiryService,
    public report:ReportService,
    private dialog : MatDialog,
    private fb:FormBuilder,
    private titleService: Title) { }
  ngOnInit(): void {

    // to change the tab Title name .
    this.titleService.setTitle('استعلام');

    this.getAllMaintIntro();

    this.enquiryForm = this.fb.group({
      intro_id: [null],
      intro_id1: [null],
      dateBill: [null],
      dateBill1: [null],
      request_statues: [[this.toppingList[0]]],
      phone: [null],
    });

  }
  getAllMaintIntroEnquiry() {
  
    this.enquiry.GetAllMaintIntroEnquiry(this.enquiryForm.value).subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;
    });
  }

  onSearch(){
    this.getAllMaintIntroEnquiry();

  }

  onSubmit(){

  this.spinner.show();
  this.model = this.enquiryForm.value;
    this.getAllMaintIntroEnquiry();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

} 
  
  getAllMaintIntro() {
    this.enquiry.GetAllMaintIntro().subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;

    });
  }
  PrintInvoice(dataList:any) {
    const modifiedDataList = dataList.map(data => {
      return {
        intro_id : data.intro_id,
        intro_date : data.intro_date,
        devicePor : data.devicePor,
        customers_FName1 : data.customers_FName1,
        start_date : data.start_date,
        end_Date : data.end_Date,
        follow_maint : data.follow_maint,
        Request_statues : data.request_statues,
        // ... include other properties as needed
      };
    });
    this.report.Enquiry(modifiedDataList).subscribe((response: any) => {
      const blobResponse: Blob = response.body as Blob;
        const url = window.URL.createObjectURL(blobResponse);
        window.open(url);
    });
  }
  
  DownloadInvoice(dataList:any) {
    const modifiedDataList = dataList.map(data => {
      return {
        intro_id : data.intro_id,
        intro_date : data.intro_date,
        devicePor : data.devicePor,
        customers_FName1 : data.customers_FName1,
        start_date : data.start_date,
        end_Date : data.end_Date,
        follow_maint : data.follow_maint,
        Request_statues : data.request_statues, 
      
        // ... include other properties as needed
      };
    });
    this.report.Enquiry(modifiedDataList).subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'Enquiry.pdf';
  
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
  
 onEmergencyStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus === 'الجميع') {
      this.enquiryForm.controls.Request_statues.setValue(0);
    } 
    if (selectedStatus === 'لم يتم تحويل الطلب') {
      this.enquiryForm.controls.Request_statues.setValue(0);
      this.enquiryForm.controls.technical.setValue(0);
    } 
    if (selectedStatus === 'لم يتم العمل عليه') {
      this.enquiryForm.controls.Request_statues.setValue(0);
      this.enquiryForm.controls.technical.setValue(1);

    } 
     else if (selectedStatus === 'بحاجة الى قطع') {
      this.enquiryForm.controls.Request_statues.setValue(1);
    }
    else if (selectedStatus === 'لاغي') {
      this.enquiryForm.controls.Request_statues.setValue(2);
    }
    //  else if (selectedStatus === 'تمت الصيانة') {
    //   this.enquiryForm.controls.Request_statues.setValue(3);
    // }
     else if (selectedStatus === 'لم تتم الصيانة') {
      this.enquiryForm.controls.Request_statues.setValue(4);
    }
     else if (selectedStatus === 'موافقة العميل') {
      this.enquiryForm.controls.Request_statues.setValue(5);
    }
     else if (selectedStatus === 'سحب الجهاز') {
      this.enquiryForm.controls.Request_statues.setValue(6);
    }
    //  else if (selectedStatus === 'منتهي') {
    //   this.enquiryForm.controls.Request_statues.setValue(7);
    // }
     else if (selectedStatus === 'اصدار سند قبض') {
      this.enquiryForm.controls.Request_statues.setValue(8);
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
