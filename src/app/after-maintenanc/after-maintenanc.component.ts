import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EditCustomersComponent } from 'app/edit-customers/edit-customers.component';
import { ReportService } from 'app/services/Reportservice';
import { AfterMaintenancService } from 'app/services/after-maintenanc.service';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-after-maintenanc',
  templateUrl: './after-maintenanc.component.html',
  styleUrls: ['./after-maintenanc.component.scss']
})
export class AfterMaintenancComponent implements OnInit {
  @ViewChild('customerDeleteDialog') customerDeleteDialog! :TemplateRef<any>
  currentDate : Date;
  lastIntroID : number;
row:any;
  displayedColumns: string[] = [ 'intro_id','intro_date' ,'intro_Emergency', 'devicePor', 'customers_Address' ,'intro_InOut','customers_Fname1','request_statues' ,'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
 
  maxTooltipLength = true||10; // Adjust the value as per your requirements

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public afterMaintenanc:AfterMaintenancService,
    public requests:MaintenanceRequestsService,
    public report:ReportService,
    private dialog : MatDialog,
    private router: Router ,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private titleService: Title
){    }
intro_id1:number;
intro_idOld:number;
   
  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('متابعة');


    this.GetFollowMaintList();
    this.currentDate = new Date();
    this.GetLastIntroID();
    


  }
  @ViewChild('AddDialog') AddDialog!:TemplateRef<any>;

 

  GetFollowMaintList() {
    this.afterMaintenanc.GetFollowMaintList().subscribe((data) => {
      this.dataSource.data = data;
    });
  }


  viewafterMain(row :any){
    this.router.navigate(['/Followmaint'], {queryParams:row});

  }





OpenEditCustomerDialog(id:any)
{
this.dialog.open(EditCustomersComponent,{
  width:'40%'
})
}

OpenViweCustomerDialog(id:any)
{
this.dialog.open(EditCustomersComponent,{
  width:'40%'
})
}
GetLastIntroID() {
  this.requests.GetLastIntroID().subscribe((data) => {
    if (data && data.length > 0) {
      this.lastIntroID = data[0].maxx;
    }
  });
}



DownloadInvoice() {
  this.report.AfterMaintenance().subscribe(
    (res: any) => {
      const contentDispositionHeader = res.headers.get('content-disposition');
      const fileName = contentDispositionHeader
        ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
        : 'AfterMaintenance.pdf';

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
  this.report.AfterMaintenance().subscribe((response: any) => {
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


  closeandNew(model: any) {
    const formattedDate = this.currentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    model.intro_date = formattedDate;
    model.intro_disc = model.intro_id + "  رقم الصيانة القديم ";
    model.CustomersNum = model.customersNum;
    model.ExhibitionID = model.exhibitionID;
    model.DeviceSR = model.deviceSR;
    model.CountDevise = model.countDevise;
    model.status_Intro = 'مشكوك';

    this.intro_idOld =model.intro_id;
    this.requests.addIntro(model).subscribe(
      
      () => {
        this.toastr.success("تم اضافة طلب صيانة جديد بنجاح");
        this.spinner.hide();
        this.Editclose(model);
      },
      (error) => {
        if (error.status == 200) {
          this.toastr.success("تم اضافة طلب صيانة جديد بنجاح");
          this.spinner.hide();
          this.Editclose(model);
       //   this.EditeRequest(model.request_statues);


        } else {
          this.toastr.error(" لم يتم اضافه الطلب");
          this.spinner.hide();
        }
      }
    );

  }
  // EditeRequest(id:number){
  //   this.requests.EditeRequest(id).subscribe(() => {
  
  //   }, error => {
  //     if(error.status==200)
  //     {
  //       this.toastr.success("تم تعديل طلب  بنجاح")
  //       this.spinner.hide();
  //     }
  //     else
  //     {
  //       this.toastr.error("حدث خطأ")
  //       this.spinner.hide();
  
  //     }
      
      
  //   });
  

  // }
    
  Editclose(model:any){
    model.intro_id=this.intro_idOld;
    model.intro_disc ='-------';

    model.intro_discT = this.lastIntroID + "  رقم الصيانة الجديد  " ;
    model.CustomersNum =model.customersNum;
    model.ExhibitionID =model.exhibitionID;
    model.DeviceSR =model.deviceSR;
    model.countDevice =model.countDevise;
    model.status_Intro =1;
    model.request_statues =9;



    this.requests.editIntro(model).subscribe(() => {
  
    }, error => {
      if(error.status==200)
      {
        this.toastr.success("تم تعديل طلب  بنجاح")
        this.spinner.hide();
      }
      else
      {
        this.toastr.error("لم يتم تعديل الطلب ")
        this.spinner.hide();
  
      }
      
      
    });
  

  }
    

 


 }
