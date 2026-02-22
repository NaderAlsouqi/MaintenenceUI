import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  constructor(
    private http: HttpClient,
    private toster: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  url = environment.baseUrl;

  GetAllMaintIntro(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenance/GetAllMaintIntro').pipe(
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

  GetAllMaintIntroEnquiry(model:any): Observable<any> {

    this.spinner.show();
    return this.http.post(this.url + 'TblMaintenanceIntro/GetAllMaintIntroEnquir',model).pipe(
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
