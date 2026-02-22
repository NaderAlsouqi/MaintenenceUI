
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AddScheduledMaintenanceComponent } from 'app/add-scheduled-maintenance/add-scheduled-maintenance.component';
import { EditScheduledMaintenanceComponent } from 'app/edit-scheduled-maintenance/edit-scheduled-maintenance.component';
import { ReportService } from 'app/services/Reportservice';
import { BillsService } from 'app/services/bills.service';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { ScheduledService } from 'app/services/scheduled.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-scheduled-maintenance',
  templateUrl: './scheduled-maintenance.component.html',
  styleUrls: ['./scheduled-maintenance.component.scss']
})
export class ScheduledMaintenanceComponent implements OnInit {


  
  displayedColumns: string[] = [
    'id',
    'status',
    'customersNum',
    'maintenanceDate',
    'customerName',
    'city',
    'action'
   
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  ScheduledForm!: FormGroup;
  bills:any;
  currentDate: Date;
 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;
 searchedData:any[];

  constructor(
    public scheduled:ScheduledService,
    public report:ReportService,
    private dialog : MatDialog,
    private fb:FormBuilder,
    public requests:MaintenanceRequestsService,
    private bill:BillsService,
    private toster:ToastrService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private titleService: Title) { }
    ngOnInit(): void {
      // to change the tab Title name .
    this.titleService.setTitle('الصيانة الدورية');
      
      this.updateClosedMaintenanceStatus();
      this.ScheduledForm = this.fb.group({
        date1: [null],
        date2: [null],
        search: [null],
      });
      
      this.getScheduled_Maintenanc({search:'initialGet'});
     
  
     
     
  
      }
    
        
  
  @ViewChild('AddDialog') AddDialog!:TemplateRef<any>;
  @ViewChild('EditDialog') EditDialog!:TemplateRef<any>;


  // getScheduled_Maintenanc(search:any) {
  //   this.scheduled.GetScheduled_Maintenanc(search).subscribe((data) => {
  //     this.dataSource.data = data;
  //     this.searchedData = data;

  //   });
  // }


  getScheduled_Maintenanc(search: any) {
    this.scheduled.GetScheduled_Maintenanc(search).subscribe((data) => {
    this.dataSource.data = data;
    
    const currentDate2 = new Date();
    currentDate2.setDate(currentDate2.getDate() + 1); // Subtract one day



      const formattedTomorrow = currentDate2.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'

});

      const day = formattedTomorrow;
      this.dataSource.data = data.map((order: any) => {

        if (order.maintenanceDate === day && order.status==='1') {
          this.bill.GetMaintenanceId(order.intro_id).subscribe((res) => {

           
            const formattedYesterday = currentDate2.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
      
      });
 
            const   editScheduleds ={
              id: order.id,
              maintenanceDate:order.maintenanceDate,
              status:'0',
              CustomersNum:order.customersNum, 
              intro_id:order.intro_id,
             }            
            
            this.bills = res;
           
  
            const   maintenanceData ={
              intro_date: formattedYesterday,
              intro_Emergency: 'غير طارئة',
              CustomersNum: this.bills.customersNum,
              intro_InOut: 'خارجية',
              ExhibitionID:this.bills.exhibitionID,
              ExhibitionIDNmAr: this.bills.exhibitionIDNmAr,
              DeviceSR: '0',
              intro_damage: this.bills.intro_damage,
              intro_disc: this.bills.intro_disc,
              deviceType_ID:this.bills.deviceType_ID,
              deviceType_Name: this.bills.deviceType_Name,
              deviceModel_ID:this.bills.deviceModel_ID,
              deviceModel_Name: this.bills.deviceModel_Name,
              devicePro_ID:this.bills.devicePro_ID,
              devicePor: this.bills.devicePor,
              intro_discT:this.bills.intro_discT,
              barcode: this.bills.barcode,
              datePurchase: this.bills.datePurchase,
              insert_By: this.bills.insert_By,
              status_Intro: ['مشكوك'],
              status_Intro_Name: ' ',
              CountDevise: this.bills.countDevise,
          }
          
        this.requests.addIntro(maintenanceData).subscribe(
              () => {
                this.toastr.success("تمت إضافة طلب صيانة جديد بنجاح");
                this.spinner.hide();
              },
              (error) => {
                if (error.status == 200) {
                  this.toastr.success("تم اضافة طلب صيانة جديد بنجاح");
                  this.spinner.hide();
                } else {
                  this.toastr.error(" لم يتم اضافة طلب جديد");
                  this.spinner.hide();
                }
              }
            );
              this.scheduled.updateScheduledMaintenance(editScheduleds).subscribe(() => {

               }, error => {
                 if(error.status==200)
                 {
                   this.toster.success("تم تعديل طلب صيانة الدورية بنجاح")
                   this.spinner.hide();
                 }
                 else
                 {
                   this.toster.error("لم يتم تعديل تعديل طلب صيانة الدورية ")
                   this.spinner.hide();
             
                 }
                 
               });
             
             
           
         });
        }
        return order;
     
      });
    
  
      this.searchedData = data;
 });
  }
  
  updateClosedMaintenanceStatus() {
    this.scheduled.UpdateClosedMaintenanceStatus().subscribe((data) => {
      this.dataSource.data = data;

    });
  }
  Convert(row){

    this.bill.GetMaintenanceId(row.intro_id).subscribe((res) => {



      console.log(row)
      const   editScheduleds ={
        id: row.id,
        maintenanceDate:row.maintenanceDate,
        status:'0',
        CustomersNum:row.customersNum, 
        intro_id:row.intro_id,
       }
       const currentDate2 = new Date();

      const formattedYesterday = currentDate2.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) ;

      
      this.bills = res;
     

      const   maintenanceData ={
        intro_date: formattedYesterday,
        intro_Emergency: 'غير طارئة',
        CustomersNum: this.bills.customersNum,
        intro_InOut: 'خارجية',
        ExhibitionID:this.bills.exhibitionID,
        ExhibitionIDNmAr: this.bills.exhibitionIDNmAr,
        DeviceSR: '0',
        intro_damage: this.bills.intro_damage,
        intro_disc: this.bills.intro_disc,
        deviceType_ID:this.bills.deviceType_ID,
        deviceType_Name: this.bills.deviceType_Name,
        deviceModel_ID:this.bills.deviceModel_ID,
        deviceModel_Name: this.bills.deviceModel_Name,
        devicePro_ID:this.bills.devicePro_ID,
        devicePor: this.bills.devicePor,
        intro_discT:this.bills.intro_discT,
        barcode: this.bills.barcode,
        datePurchase: this.bills.datePurchase,
        insert_By: this.bills.insert_By,
        status_Intro: ['مشكوك'],
        status_Intro_Name: ' ',
        CountDevise: this.bills.countDevise,
    }
    
  this.requests.addIntro(maintenanceData).subscribe(
        () => {
          this.toastr.success("تمت إضافة طلب جديد بنجاح");
          this.spinner.hide();
        },
        (error) => {
          if (error.status == 200) {
            this.toastr.success("تم اضافة طلب جديد بنجاح");
            this.spinner.hide();
          } else {
            this.toastr.error(" لم يتم اضافة طلب صيانة");
            this.spinner.hide();
          }
        }
      );
        this.scheduled.updateScheduledMaintenance(editScheduleds).subscribe(() => {

         }, error => {
           if(error.status==200)
           {
             this.toster.success("تم تعديل طلب صيانة جديد بنجاح")
             this.getScheduled_Maintenanc({search:'initialGet'});
             this.spinner.hide();
           }
           else
           {
             this.toster.error("لم يتم تعديل طلب صيانة ")
             this.spinner.hide();
       
           }
           
         });
       
       
     
   });
  }
  Submit() {
    if(this.ScheduledForm.value == null || this.ScheduledForm.value == ''){
      this.getScheduled_Maintenanc({search:'initialGet'});
    }
    else{
      this.getScheduled_Maintenanc(this.ScheduledForm.value);
    }
  }

EditScheduled(area: any) {
  const dialogRef = this.dialog.open(EditScheduledMaintenanceComponent, {
    width: '40%',
    data: area,
  });
  dialogRef.afterClosed().subscribe(() => {
    // Handle dialog close event if needed
    this.getScheduled_Maintenanc({search:'initialGet'});
  });
  }
 
AddScheduled()
{
  const dialogRef = this.dialog.open(AddScheduledMaintenanceComponent,{
  width:'40%'

});
dialogRef.afterClosed().subscribe(() => {
  // Handle dialog close event if needed
  this.getScheduled_Maintenanc({search:'initialGet'});
});
}
PrintInvoice(dataList:any) {
  const modifiedDataList = dataList.map(data => {
    return {
      id: data.id,
      status: data.status,
      customersNum: data.customersNum,
      maintenanceDate: data.maintenanceDate,
      CustomerName: data.customerName,
      City: data.city,
    
      // ... include other properties as needed
    };
  });
  this.report.GetScheduled_MaintenancPdf(modifiedDataList).subscribe((response: any) => {
    const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
  });
}

DownloadInvoice(dataList:any) {
  const modifiedDataList = dataList.map(data => {
    return {
      id: data.id,
      status: data.status,
      customersNum: data.customersNum,
      maintenanceDate: data.maintenanceDate,
      CustomerName: data.customerName,
      City: data.city,
      // ... include other properties as needed
    };
  });
  this.report.GetScheduled_MaintenancPdf(modifiedDataList).subscribe(
    (res: any) => {
      const contentDispositionHeader = res.headers.get('content-disposition');
      const fileName = contentDispositionHeader
        ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
        : 'GetScheduled_MaintenancPdf.pdf';

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

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

} 
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}