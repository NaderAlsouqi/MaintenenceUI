import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AddAreaComponent } from 'app/add-area/add-area.component';
import { AddWarehouseComponent } from 'app/add-warehouse/add-warehouse.component';
import { EditAreaComponent } from 'app/edit-area/edit-area.component';
import { EditWarehouseComponent } from 'app/edit-warehouse/edit-warehouse.component';
import { ReportService } from 'app/services/Reportservice';
import { AreaService } from 'app/services/area.service';
import { WarehousesService } from 'app/services/warehouses.service';
import { ViewAreaComponent } from 'app/view-area/view-area.component';
import { ViewWarehouseComponent } from 'app/view-warehouse/view-warehouse.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})

export class WarehouseComponent implements OnInit {
  @ViewChild('WarehousesDeleteDialog') WarehousesDeleteDialog!: TemplateRef<any>

  displayedColumns: string[] = ['WarehouseNumber', 'WarehouseNameArabic', 'WarehouseNameEnglish', 'WarehouseLocation', 'PhoneNumber', 'UserNmAr', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public area: AreaService,
    public warehouse: WarehousesService,
    public report: ReportService,
    private dialog: MatDialog,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('المستودعات');

    this.getAllwarehouse();
    this.dataUpdated();

  }

  getAllwarehouse() {
    this.warehouse.getAllwarehouse().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  dataUpdated() {
    this.warehouse.dataUpdated$.subscribe(() => {
      this.getAllwarehouse();
    });
  }

  openDeleteDialog(id: any) {
    console.log('Opening delete dialog for id:', id);
    const dialogRef = this.dialog.open(this.WarehousesDeleteDialog);

    dialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog closed with result:', res);
      if (res !== undefined) {
        if (res === 'yes') {
          console.log('User confirmed delete, calling API for id:', id);
          this.warehouse.deleteWarehouse(id).subscribe(
            (response) => {
              console.log('Delete successful:', response);
            },
            (error) => {
              console.error('Delete error:', error);
            }
          );
        } else {
          console.log('User cancelled delete');
        }
      }
    });
  }

  openDialog() {
    const dialogRef =
      this.dialog.open(AddWarehouseComponent, {
        width: '40%'


      });
    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAllwarehouse();
    });
  }

  OpenEditWarehousDialog(Warehous: any) {
    const dialogRef = this.dialog.open(EditWarehouseComponent, {
      width: '40%',
      data: Warehous,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAllwarehouse();
    });
  }

  viewArea(Warehous: any): void {
    const dialogRef = this.dialog.open(ViewWarehouseComponent, {
      width: '40%',
      data: Warehous,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed

    });
  }

  DownloadInvoice() {
    this.report.GeneratePdf_Warehouses().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'GeneratePdf_Warehouses.pdf';

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
    this.report.GeneratePdf_Warehouses().subscribe((response: any) => {
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