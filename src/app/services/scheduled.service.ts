import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ScheduledService {
  constructor(private http:HttpClient,private router :Router,private toster:ToastrService,private spinner:NgxSpinnerService) { }
  url=environment.baseUrl;



  GetAllMaintIntroState(intro_id:number): Observable<any> {
    this.spinner.show();
    const apiUrl = `${this.url}Tbl_Scheduled_Maintenance/GetAllMaintIntroState?intro_id=${intro_id}`;
  return this.http.get(apiUrl).pipe(
    map((res) => {
        this.spinner.hide();
      //  this.toster.success("Data Returned");
        return res;
      })
    );
  }

  GetScheduled_Maintenanc(search: any): Observable<any> {
    // Format dates
    if (search.date1) {
      search.date1 = this.formatDate(search.date1);
    }
    if (search.date2) {
      search.date2 = this.formatDate(search.date2);
    }
  
    this.spinner.show();
    return this.http.post(this.url + 'Tbl_Scheduled_Maintenance/GetScheduled_Maintenanc',search).pipe(
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

  // Helper function to format date to dd/mm/yyyy
private formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

  addNewScheduledMaintenance(model:any){

      const fromData=new FormData();
      fromData.append('id',model.id);     
      fromData.append('intro_id',model.intro_id);     
       // Format datePurchase
       if (model.maintenanceDate!=null){
    const maintenanceDate = new Date(model.maintenanceDate);
    const formattedDatePurchase = `${maintenanceDate.getDate()}/${maintenanceDate.getMonth() + 1}/${maintenanceDate.getFullYear()}`;
      fromData.append('maintenanceDate',formattedDatePurchase);  }                         
      fromData.append('CustomersNum',model.CustomersNum);
      if(model.status=='تم تحويل الطلب' ||model.status=='0'){
        fromData.append('status', '0');
      }
      else if(model.status== 'لم يتم تحويل الطلب'||model.status=='1'){
        fromData.append('status', '1');
      
      }
      return this.http.post(this.url+"Tbl_Scheduled_Maintenance/AddNewScheduledMaintenance",fromData).pipe(
        map((value:any) =>
        {

        })
        );
  }

  updateScheduledMaintenance(model: any): Observable<any> {
      const fromData=new FormData();
      fromData.append('id',model.id);
      fromData.append('intro_id',model.intro_id);
      
        fromData.append('maintenanceDate',model.maintenanceDate);     
      fromData.append('CustomersNum',model.CustomersNum);

      if(model.status=='تم تحويل الطلب' ||model.status=='0'){
        fromData.append('status', '0');
      }
      else if(model.status== 'لم يتم تحويل الطلب'||model.status=='1'){
        fromData.append('status','1');
      
      }
      return this.http.put(this.url + 'Tbl_Scheduled_Maintenance/UpdateScheduledMaintenance', fromData).pipe(
        map((res: any) => {
          this.toster.success('تم التعديل :) ');
          //this.GetScheduled_Maintenanc(model).subscribe(); // Update all customers after editing

          return res;
        }),
        catchError((err) => {
          if (err.status === 200) {
            this.toster.success('تم التعديل :) ');
           // this.GetScheduled_Maintenanc(model).subscribe(); // Update all customers after editing

          } else {
            this.toster.error('لم يتم التعديل');
          }
          throw err;
        })
      );
  }

  UpdateClosedMaintenanceStatus():Observable<any> {
      this.spinner.show();
      return this.http.get(this.url + 'Tbl_Scheduled_Maintenance/UpdateClosedMaintenanceStatus').pipe(
        map((res: any) => {
          //this.toster.success('تم التعديل :) ');
          //this.GetScheduled_Maintenanc(model).subscribe(); // Update all customers after editing

          return res;
        }),
        catchError((err) => {
          if (err.status === 200) {
      //      this.toster.success('تم التعديل :) ');
           // this.GetScheduled_Maintenanc(model).subscribe(); // Update all customers after editing

          } else {
       //     this.toster.error('لم يتم التعديل');
          }
          throw err;
        })
      );
  }

  GetCustomersName(): Observable<any> {
      this.spinner.show();
      return this.http.get(this.url + 'TblCustomer/GetCustomersName').pipe(
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

}