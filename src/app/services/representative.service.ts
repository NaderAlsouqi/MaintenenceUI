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

export class RepresentativeService {
  private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  updateData() {
    this.dataUpdatedSource.next();
  }
  constructor(private http:HttpClient,private router :Router,private toster:ToastrService,private spinner:NgxSpinnerService) { }

  url=environment.baseUrl;

  getExhibition(): Observable<any> {
    this.spinner.show(); // Show the spinner

    return this.http.get(this.url + 'Tbl_Exhibition/GetExhibition').pipe(
      tap((res: any) => {
        this.spinner.hide(); // Hide the spinner
       // this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide(); // Hide the spinner
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  GetDevice(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'Tbl_Device/GetDevice').pipe(
      tap((res: any) => {
        this.spinner.hide();
      //  this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  addRepresentative(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('id', model.id);
    formData.append('deviceType', model.deviceType);
    formData.append('deviceSR', model.deviceSR);
    formData.append('customersNum', model.customersNum);
    formData.append('customers_FName', model.customers_FName);
    formData.append('deviceID', model.deviceID);

    return this.http.post(this.url + 'Tbl_Device/AddNewDevice', formData).pipe(
      map((res: any) => {
        // Process the response if needed
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  editRepresentative(model: any): Observable<any> {
  
    const formData = new FormData();
    formData.append('id', model.id);
    formData.append('deviceType', model.deviceType);
    formData.append('deviceSR', model.deviceSR);
    formData.append('customersNum', model.customersNum);
    formData.append('customers_FName', model.customers_FName);
    formData.append('deviceID', model.deviceID);
    //formData.append('customersNumNavigation', model.customersNumNavigation);
  

    return this.http.put(this.url + 'Tbl_Device/EditeDevice', formData).pipe(
      map((res: any) => {
        this.toster.success('تم التعديل:) ');
        this.GetDevice().subscribe(); // Update all customers after editing
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
          this.GetDevice().subscribe(); // Update all customers after editing
        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  deleteDevice(id: number): Observable<any> {
    return this.http.delete(this.url + 'Tbl_Device/DeleteDevice/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف :) ');
        this.GetDevice().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.GetDevice().subscribe(() => {
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