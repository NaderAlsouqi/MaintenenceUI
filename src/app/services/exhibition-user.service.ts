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

export class ExhibitionUserService {

  constructor(private http:HttpClient,private router :Router,private toster:ToastrService,private spinner:NgxSpinnerService) { }
  url=environment.baseUrl;
  getAllExhibitionUser(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'Tbl_Exhibition/GetExhibition').pipe(
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

  deleteUserExhibition(id: number): Observable<any> {
    this.spinner.show();
    return this.http.delete(this.url + 'Tbl_Exhibition/DeleteExhibition/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف');
        this.spinner.hide();
        this.getAllExhibitionUser().subscribe(); // Update all Faults after deletion
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.getAllExhibitionUser().subscribe(); // Update all Faults after deletion
          this.toster.success('تم الحذف');
          this.spinner.hide();
        } else {
          this.toster.error('لم يتم الحذف');
          this.spinner.hide();
        }
        throw err;
      })
    );
  }

}
