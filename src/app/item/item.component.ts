import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AddNewItemComponent } from 'app/add-new-item/add-new-item.component';
import { EditNewItemComponent } from 'app/edit-new-item/edit-new-item.component';
import { ReportService } from 'app/services/Reportservice';
import { ItemService } from 'app/services/item.service';
import { ViewNewItemComponent } from 'app/view-new-item/view-new-item.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @ViewChild('itemDeleteDialog') itemDeleteDialog! :TemplateRef<any>

 

  
  displayedColumns: string[] = ['ItemNumber','ItemName','ItemPieces','ItemPiece','WarehouseNameArabic','action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 

 constructor(
  public item:ItemService,
  public report:ReportService,
  private dialog : MatDialog,
  private titleService: Title
  ) { }

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('المواد');

    this.getAllitem();
    this.dataUpdated();
  
  }


  getAllitem() {
    this.item.getAllitem().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  dataUpdated() {
    this.item.dataUpdated$.subscribe(() => {
      this.getAllitem();
    });
  }




  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.itemDeleteDialog);
    
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.item.deleteItem(id).subscribe(() => {
          
          }
          );
        } else {
        }
      }
    });
  }
  
  
  openDialog(){
const dialogRef =
  this.dialog.open(AddNewItemComponent,{
   width:'40%'
   

  });
  dialogRef.afterClosed().subscribe(() => {
    // Handle dialog close event if needed
    this.getAllitem();
  });
  }

 
  OpenEdititemDialog(item: any) {
    const dialogRef = this.dialog.open(EditNewItemComponent, {
      width: '40%',
      data: item,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      this.getAllitem();
    });
  }



  viewArea(item: any): void {
    const dialogRef = this.dialog.open(ViewNewItemComponent, {
      width: '40%',
      data: item,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
      
    });
  }
  DownloadInvoice() {
    this.report.GeneratePdf_Item().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'GeneratePdf_Item.pdf';
  
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
    this.report.GeneratePdf_Item().subscribe((response: any) => {
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