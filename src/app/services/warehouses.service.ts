import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, map, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class WarehousesService {
  private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  updateData() {
    this.dataUpdatedSource.next();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,

    private toster: ToastrService, private spinner: NgxSpinnerService) { }
  url = environment.baseUrl;
  GetWarehouseNames(): Observable<any> {
    this.spinner.show();
    const userId = this.auth.getUserId();

    return this.http.get(this.url + `TblWarehouses/GetWarehouseNames/${userId}`).pipe(
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
  getAllwarehouse(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblWarehouses/GetAllWarehouses').pipe(
      tap((res: any) => {
        this.spinner.hide();
        // this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  AddWarehouse(model: any) {

    const formData = new FormData();
    formData.append('WarehouseNameArabic', model.WarehouseNameArabic);
    formData.append('WarehouseNameEnglish', model.WarehouseNameEnglish);
    formData.append('WarehouseLocation', model.WarehouseLocation);
    formData.append('PhoneNumber', model.PhoneNumber);
    formData.append('UserID', model.UserID);

    return this.http.post(this.url + "TblWarehouses/AddWarehouse", formData).pipe(
      map((value: any) => {

      })
    );
  }



  UpdateWarehouse(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('WarehouseNumber', model.WarehouseNumber);
    formData.append('WarehouseNameArabic', model.WarehouseNameArabic);
    formData.append('WarehouseNameEnglish', model.WarehouseNameEnglish);
    formData.append('WarehouseLocation', model.WarehouseLocation);
    formData.append('PhoneNumber', model.PhoneNumber);
    formData.append('UserID', model.UserID);
    formData.append('UserNmAr', model.UserNmAr);


    return this.http.put(this.url + 'TblWarehouses/UpdateWarehouse', formData).pipe(
      map((res: any) => {
        this.toster.success('تم التعديل :) ');
        this.getAllwarehouse().subscribe(); // Update all customers after editing

        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
          this.getAllwarehouse().subscribe(); // Update all customers after editing

        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  deleteWarehouse(id: number): Observable<any> {
    return this.http.delete(this.url + 'TblWarehouses/DeleteWarehouse/' + id, { responseType: 'text' }).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف :) ');
        this.getAllwarehouse().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        this.toster.error('لم يتم الحذف');
        throw err;
      })
    );
  }

}
