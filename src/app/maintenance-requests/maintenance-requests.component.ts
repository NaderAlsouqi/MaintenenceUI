import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentUploadDialogComponent } from 'app/attachment-upload-dialog/attachment-upload-dialog.component';
import { EditCustomersComponent } from 'app/edit-customers/edit-customers.component';
import { ReportService } from 'app/services/Reportservice';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { ViewAttachmentsDialogComponent } from 'app/view-attachments-dialog/view-attachments-dialog.component';
import { ViewMaintenanceRequestsComponent } from 'app/view-maintenance-requests/view-maintenance-requests.component';

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.scss']
})
export class MaintenanceRequestsComponent implements OnInit {

  @ViewChild('deleteDialog') deleteDialog! :TemplateRef<any>

  
  displayedColumns: string[] = [
    'intro_id',
    'customerID',
    'customersNum',
    'customerName',
    'typeName',
    'modelName',
    'productName',
    'countDevice',
    'datePurchase',
    'intro_damage',
    'intro_disc',
    'intro_discT',
    'action',
  ];
  
  searchedData:any[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  customerSearchValue: string;
  currentDate : Date;
  lastIntroID : number;

  intro_idFromManager : any = null;
  maxTooltipLength = 10; // Adjust the value as per your requirements

 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public requests:MaintenanceRequestsService,
    public report:ReportService,
    private dialog : MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title ) { }
  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('طلبات الصيانة');


    this.LoadHistoryData('initialGet');
    this.currentDate = new Date();
    this.GetLastIntroID();
    this.dataUpdated();

    //getting the intro_idFromManager from the MaintenanceManager page using the route params.
    this.route.queryParams.subscribe(params => {
      this.intro_idFromManager = params['intro_id'];
    });

    if(this.intro_idFromManager != null){
      this.customerSearchValue = this.intro_idFromManager;
      this.Search();

    }
  }
  @ViewChild('AddDialog') AddDialog!:TemplateRef<any>;
  @ViewChild('EditDialog') EditDialog!:TemplateRef<any>;



  
  GetLastIntroID() {
    this.requests.GetLastIntroID().subscribe((data) => {
      if (data && data.length > 0) {
        this.lastIntroID = data[0].maxx;
      }
    });
  }

  dataUpdated() {
    this.requests.dataUpdated$.subscribe(() => {
      this.LoadHistoryData('initialGet');
    });
  }
  LoadHistoryData(search:any) {
    this.requests.LoadHistoryData(search).subscribe((data) => {
      this.dataSource.data = data;
      this.searchedData = data;
    });
  }


  Search() {
    if(this.customerSearchValue == null || this.customerSearchValue == ''){
      this.LoadHistoryData('initialGet');
    }
    else{
      this.LoadHistoryData(this.customerSearchValue);
    }
  }

  viewrequests(row :any){
    this.router.navigate(['/viewrequests'], {queryParams:row});
  }

  editrequests(row :any){
    this.router.navigate(['/editrequests'], {queryParams:row});
  }
  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.deleteDialog);
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.requests.Deleterequest(id).subscribe(() => {
            if(this.customerSearchValue == null || this.customerSearchValue == ''){
              this.LoadHistoryData('initialGet');
            }
            else{
              this.LoadHistoryData(this.customerSearchValue);
            }
          });
        } else if (res === 'no') {
        }
      }
    });
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


OpenEditCustomerDialog(id:any)
{
this.dialog.open(EditCustomersComponent,{
  width:'40%'
})
}

/*
viewFull(customer: any): void {
  const dialogRef = this.dialog.open(ViewCustomerDialogComponent, {
    width: '40%',
    data: customer,
  });

  dialogRef.afterClosed().subscribe(() => {
    // Handle dialog close event if needed
  });
}
*/



PrintInvoice(dataList:any) {
  const modifiedDataList = dataList.map(data => {
    return {
      intro_id: data.intro_id,
      CustomersID: data.customersID,
      customersNum: data.customersNum,
      CustomerName: data.customerName,
      TypeName: data.typeName,
      ModelName: data.modelName,
      ProductName: data.productName,
      CountDevice: data.countDevice,
      datePurchase: data.datePurchase,
      intro_damage: data.intro_damage,
      intro_disc: data.intro_disc,
      intro_discT: data.intro_discT,
      // ... include other properties as needed
    };
  });
  this.report.MaintenanceRequests(modifiedDataList).subscribe((response: any) => {
    const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
  });
}

DownloadInvoice(dataList:any) {
  const modifiedDataList = dataList.map(data => {
    return {
      intro_id: data.intro_id,
      CustomersID: data.customersID,
      customersNum: data.customersNum,
      CustomerName: data.customerName,
      TypeName: data.typeName,
      ModelName: data.modelName,
      ProductName: data.productName,
      CountDevice: data.countDevice,
      datePurchase: data.datePurchase,
      intro_damage: data.intro_damage,
      intro_disc: data.intro_disc,
      intro_discT: data.intro_discT,
      // ... include other properties as needed
    };
  });
  this.report.MaintenanceRequests(modifiedDataList).subscribe(
    (res: any) => {
      const contentDispositionHeader = res.headers.get('content-disposition');
      const fileName = contentDispositionHeader
        ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
        : 'MaintenanceRequests.pdf';

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
