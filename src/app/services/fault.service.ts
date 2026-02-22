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

export class FaultService { private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  updateData() {
    this.dataUpdatedSource.next();
  }

  constructor(private http:HttpClient,private router :Router,private toster:ToastrService,private spinner:NgxSpinnerService) { }
  url=environment.baseUrl;

  getAllFault(): Observable<any> {
    debugger;
    this.spinner.show();
    return this.http.get(this.url + 'TblFault/GetFaults').pipe(
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

  GetFaultNames(id: number): Observable<any> {
  this.spinner.show();
  return this.http.get(this.url + `TblFault/GetFaultsNames/${id}`).pipe( // Include the 'id' in the URL
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

  AddNewFault(model:any){
    debugger;
    const formData = new FormData();
    formData.append('FaultCode', model.FaultCode);
    formData.append('FaultNameAr', model.FaultNameAr);
    formData.append('FaultName', model.FaultName);

   

    return this.http.post(this.url+"TblFault/AddNewFaults",formData).pipe(
      map((value:any) =>
      {

      })
      );
  }

  UpdateFault(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('FaultsID', model.FaultsID);
    formData.append('FaultCode', model.FaultCode);
    formData.append('FaultNameAr', model.FaultNameAr);
    formData.append('FaultName', model.FaultName);

    
    
    return this.http.put(this.url + 'TblFault/EditFaults', formData).pipe(
      map((res: any) => {
        this.toster.success('تم تعديل :) ');
        this.getAllFault().subscribe(); // Update all customers after editing

        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
          this.getAllFault().subscribe(); // Update all customers after editing

        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  deleteFault(id: number): Observable<any> {
    debugger;
    return this.http.delete(this.url + 'TblFault/DeleteFaults/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف :) ');
        this.getAllFault().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.getAllFault().subscribe(() => {
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
