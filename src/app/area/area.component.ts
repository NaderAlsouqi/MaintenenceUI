import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddAreaComponent } from 'app/add-area/add-area.component';
import { AreaService } from '../services/area.service';
import { FormControl, FormGroup } from '@angular/forms';
import { EditAreaComponent } from 'app/edit-area/edit-area.component';
import { ViewAreaComponent } from 'app/view-area/view-area.component';
import { ReportService } from 'app/services/Reportservice';
import { NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  @ViewChild('CityDeleteDialog') CityDeleteDialog!: TemplateRef<any>

  displayedColumns: string[] = ['noCity', 'cityNameAr', 'governorate', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public area: AreaService,
    public report: ReportService,
    private dialog: MatDialog,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    debugger;
    // to change the tab Title name .
    this.titleService.setTitle('المناطق');

    this.getAllarae();
    this.dataUpdated();

  }


  getAllarae() {
    debugger;
    this.area.getAllarae().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  dataUpdated() {
    this.area.dataUpdated$.subscribe(() => {
      this.getAllarae();
    });
  }




  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.CityDeleteDialog);

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.area.deleteFaults(id).subscribe(() => {

          }
          );
        } else {
        }
      }
    });
  }


  openDialog() {
    const dialogRef =
      this.dialog.open(AddAreaComponent, {
        width: '40%'


      });
    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAllarae();
    });
  }


  OpenEditAreaDialog(area: any) {
    debugger;
    const dialogRef = this.dialog.open(EditAreaComponent, {
      width: '40%',
      data: area,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAllarae();
    });
  }



  viewArea(area: any): void {
    debugger;
    const dialogRef = this.dialog.open(ViewAreaComponent, {
      width: '40%',
      data: area,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed

    });
  }

  DownloadInvoice() {
    this.report.GeneratePdf_Cities().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'Cities_Report.pdf';

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
    this.report.GeneratePdf_Cities().subscribe((response: any) => {
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