import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ItemService { private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  updateData() {
    this.dataUpdatedSource.next();
  }

  constructor(private http:HttpClient,private router :Router,private toster:ToastrService,private spinner:NgxSpinnerService) { }
  url=environment.baseUrl;

  getAllitem(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblItems/GetAllItems').pipe(
      tap((res: any) => {
        this.spinner.hide();
        //this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );

  }

  GetItemNames(id: number): Observable<any> {
  this.spinner.show();
  return this.http.get(this.url + `TblItems/GetItemNames/${id}`).pipe( // Include the 'id' in the URL
    tap((res: any) => {
      this.spinner.hide();
      //this.toster.success('Data Returned');
    }),
    catchError((err) => {
      this.spinner.hide();
      this.toster.error('لم يقم بارجاع البيانات');
      throw err;
    })
  );
  }

  AddNewItem(model:any){
    
    const formData = new FormData();
    formData.append('ItemName', model.ItemName);
    formData.append('ItemPieces', model.ItemPieces);
    formData.append('ItemPiece', model.ItemPiece);
    formData.append('WarehouseNumber', model.warehouseNumber);

   

    return this.http.post(this.url+"TblItems/AddNewItem",formData).pipe(
      map((value:any) =>
      {

      })
      );
  }

  UpdateItem(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('ItemNumber', model.ItemNumber);
    formData.append('ItemName', model.ItemName);
    formData.append('ItemPieces', model.ItemPieces);
    formData.append('ItemPiece', model.ItemPiece);
    formData.append('WarehouseNumber', model.warehouseNumber);

    
    
    return this.http.put(this.url + 'TblItems/UpdateItem', formData).pipe(
      map((res: any) => {
        this.toster.success('تم تعديل :) ');
        this.getAllitem().subscribe(); // Update all customers after editing

        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
          this.getAllitem().subscribe(); // Update all customers after editing

        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(this.url + 'TblItems/DeleteItem/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف :) ');
        this.getAllitem().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.getAllitem().subscribe(() => {
            this.updateData();
          });
        } else {
          this.toster.error('لم يتم الحذف');
        }
        throw err;
      })
    );
  }

}
