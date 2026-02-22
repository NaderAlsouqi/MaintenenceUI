import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AddDeviceDECComponent } from 'app/add-device-dec/add-device-dec.component';
import { EditDeviceDECComponent } from 'app/edit-device-dec/edit-device-dec.component';
import { ReportService } from 'app/services/Reportservice';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { VewiDeviceDECComponent } from 'app/vewi-device-dec/vewi-device-dec.component';

@Component({
  selector: 'app-all-device-dec',
  templateUrl: './all-device-dec.component.html',
  styleUrls: ['./all-device-dec.component.scss']
})
export class AllDeviceDECComponent implements OnInit {

  @ViewChild('deviceDeleteDialog') deviceDeleteDialog!: TemplateRef<any>


  displayedColumns: string[] = [
    'id',
    'devicePro_ID',
    'devicePor',
    'deviceType_ID',
    'deviceType_Name',
    'deviceModel_ID',
    'deviceModel_Name',
    'action'

  ];

  searchedData: any[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  customerSearchValue: string;
  currentDate: Date;
  lastIntroID: number;

  intro_idFromManager: any = null;
  maxTooltipLength = 10; // Adjust the value as per your requirements


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public requests: MaintenanceRequestsService,
    public report: ReportService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,

    private titleService: Title) { }
  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('تعريف الاجهزه');
    this.getAllDeviceDEC();
    this.dataUpdated();






  }


  getAllDeviceDEC() {
    this.requests.getAllDeviceDEC().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  dataUpdated() {
    this.requests.dataUpdated$.subscribe(() => {
      this.getAllDeviceDEC();
    });
  }




  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.deviceDeleteDialog);

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.requests.DeleteDeviceDEC(id).subscribe(() => {

          }
          );
        } else {
        }
      }
    });
  }




  openAddDialog() {
    const dialogRef = this.dialog.open(AddDeviceDECComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllDeviceDEC();
    });
  }

  OpenEditDeviceDEC(device: any) {
    const dialogRef = this.dialog.open(EditDeviceDECComponent, {
      width: '40%',
      data: device,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAllDeviceDEC();
    });
  }



  viewArea(device: any): void {
    const dialogRef = this.dialog.open(VewiDeviceDECComponent, {
      width: '40%',
      data: device,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed

    });
  }
  DownloadInvoice() {
    this.report.GeneratePdf_DeviceDEC().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'Pdf_Device.pdf';

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
    this.report.GeneratePdf_DeviceDEC().subscribe((response: any) => {
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
