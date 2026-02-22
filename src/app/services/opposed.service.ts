import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OpposedService {
  private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  updateData() {
    this.dataUpdatedSource.next();
  }
  constructor(
    private http:HttpClient,
    private router :Router,
    private toster:ToastrService,
    private spinner:NgxSpinnerService) { }

    url=environment.baseUrl;

  getAllExhibition(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + "Tbl_Exhibition/GetExhibition").pipe(
      map((res) => {
        this.spinner.hide();
        //this.toster.success("Data Returned");
        return res;
      })
    );
  }

  addOpposed(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('exhibitionIDNmAr', model.exhibitionIDNmAr);
    formData.append('mobile1', model.mobile1);
    formData.append('mobile2', model.mobile2);
    formData.append('address', model.address);
   //formData.append('exhib', model.exhib);
   if(model.exhib=='مول'){
    formData.append('exhib', '1');
  }
  else if(model.exhib=='معرض'){
    formData.append('exhib', '2');
  }    

   

    return this.http.post(this.url + 'Tbl_Exhibition/AddNewExhibition', formData).pipe(
      map((res: any) => {
        // Process the response if needed
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  editopposed(model: any): Observable<any> {

    const formData = new FormData();
    formData.append('exhibitionID', model.exhibitionID);
    formData.append('exhibitionIDNmAr', model.exhibitionIDNmAr);
    formData.append('mobile1', model.mobile1);
    formData.append('mobile2', model.mobile2);
    formData.append('address', model.address);
   //formData.append('exhib', model.exhib);
   if(model.exhib=='مول'){
    formData.append('exhib', '1');
  }
  else if(model.exhib=='معرض'){
    formData.append('exhib', '2');
  }   
  
  
    return this.http.put(this.url + 'Tbl_Exhibition/EditExhibition', formData).pipe(
      map((res: any) => {
        this.toster.success('تم التعديل :) ');
        this.getAllExhibition().subscribe(); // Update all customers after editing
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم تعديل:) ');
          this.getAllExhibition().subscribe(); // Update all customers after editing
        } else {
          this.toster.error('لم يتم التديل');
        }
        throw err;
      })
    );
  }

  deleteOpposed(id: number): Observable<any> {
    return this.http.delete(this.url + 'Tbl_Exhibition/DeleteExhibition/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف:) ');
        this.getAllExhibition().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.getAllExhibition().subscribe(() => {
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
