import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditTechnicalComponent } from 'app/edit-technical/edit-technical.component';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, map, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class MaintenanceTechnicianService {
   private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  updateData() {
    this.dataUpdatedSource.next();
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private toster: ToastrService,
    private spinner: NgxSpinnerService,

  ) { }
  url = environment.baseUrl;

  getAlltechnician(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'Tbl_Driver/GetDriver').pipe(
      tap((res: any) => {
        this.spinner.hide();
       // this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        //this.toster.error('Error');
        throw err;
      })
    );
  }
  
  addTechnical(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('num_Driver', model.num_Driver);
    formData.append('name_Driver', model.name_Driver);
    formData.append('address', model.address);
    formData.append('disc', model.disc);
    formData.append('phone', model.phone);
  
    if(model.driv=='سائق داخلي'){
      formData.append('driv', '1');
    }
    else if(model.driv=='فني داخلي' ){
      formData.append('driv', '3');
    } 
    else if  (model.driv=='سائق خارجي'){
      formData.append('driv', '2');
    }
    else if(model.driv=='فني خارجي' ){
      formData.append('driv', '4');
    } 
    formData.append('Driver_Status', model.Driver_Status.value);


    return this.http.post(this.url + 'Tbl_Driver/AddNewDDriver', formData).pipe(
      map((res: any) => {
        // Process the response if needed
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  editTechnical(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('driver_ID', model.driver_ID);
    formData.append('num_Driver', model.num_Driver);
    formData.append('name_Driver', model.name_Driver);
    formData.append('address', model.address);
    formData.append('disc', model.disc);
   
    if(model.driv=='سائق داخلي'){
      formData.append('driv', '1');
    }
    else if(model.driv=='فني داخلي' ){
      formData.append('driv', '3');
    } 
    else if  (model.driv=='سائق خارجي'){
      formData.append('driv', '2');
    }
    else if(model.driv=='فني خارجي' ){
      formData.append('driv', '4');
    } 

    formData.append('Driver_Status', model.Driver_Status);

    return this.http.put(this.url + 'Tbl_Driver/EditDriver', formData).pipe(
      map((res: any) => {
        this.toster.success('تم التعديل :) ');
        this.getAlltechnician().subscribe(); // Update all customers after editing
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
          this.getAlltechnician().subscribe(); // Update all customers after editing

        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  deletetechnician(id: number): Observable<any> {
    return this.http.delete(this.url + 'Tbl_Driver/DeleteDriver/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف:) ');
        this.getAlltechnician().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف:) ');
          this.getAlltechnician().subscribe(() => {
            this.updateData();
          });
        } else {
          this.toster.error('لم يتم الحذف');
        }
        throw err;
      })
    );
  }

  GetAllMaintIntro_technical_date(model:any): Observable<any> {
    this.spinner.show();

    return this.http.post(this.url +'Tbl_Device/GetAllMaintIntro_technical_date',model).pipe(
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

  GetAllMaintIntro(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenance/GetAllMaintIntro').pipe(
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

  GetAllMaintIntroTechnical(technical: number): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenance/GetAllMaintIntroTechnical/' + technical).pipe(
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
  


}
