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
export class MaintenanceManagerService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toster: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  allmaintenancerequests: any;
  url = environment.baseUrl;

  GetAllMaintIntro(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenance/GetAllMaintIntro').pipe(
      tap((res: any) => {
        this.allmaintenancerequests = res;
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

  getTechnicals(): Observable<any> {
    this.spinner.show(); // Show the spinner

    return this.http.get(this.url + 'TblUsers/GetUsersList').pipe(
      tap((res: any) => {
        this.spinner.hide(); // Hide the spinner
        //  this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide(); // Hide the spinner
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  GetMaintIntro_bet_date(model: any): Observable<any> {
    // Format dates before sending to API
    const formattedModel = { ...model };
    if (formattedModel.date1) {
      formattedModel.date1 = this.formatDate(formattedModel.date1);
    }
    if (formattedModel.date2) {
      formattedModel.date2 = this.formatDate(formattedModel.date2);
    }

    this.spinner.show();
    return this.http.post(this.url + 'Tbl_Device/GetMaintIntro_bet_date', formattedModel).pipe(
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

  searchBill(search: any): Observable<any> {
    if (search.date1) {
      search.date1 = this.formatDate(search.date1);
    }
    if (search.date2) {
      search.date2 = this.formatDate(search.date2);
    }
    if (search.UserNmAr) {
      search.UserNmAr = search.UserNmAr;
    }
    this.spinner.show();
    return this.http.post(this.url + 'Tbl_Device/searchBill', search).pipe(
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

  // Helper function to format date to dd/mm/yyyy
  private formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  addUserMaint(intro_id: any, technical_id: any) {
    const formData = new FormData();
    formData.append('intro_id', intro_id);
    formData.append('technical', technical_id);

    return this.http.post(this.url + 'TblMaintenanceIntro/AddUserMaint', formData).pipe(
      map((res: any) => {
        // Process the response if needed
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

}
