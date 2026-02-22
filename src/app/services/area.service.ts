import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, map, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  updateData() {
    this.dataUpdatedSource.next();
  }

  constructor(private http:HttpClient,private router :Router,private toster:ToastrService,private spinner:NgxSpinnerService) { }
  url=environment.baseUrl;

 
  getAllarae(): Observable<any> {
    debugger;
    this.spinner.show();                     
    return this.http.get(this.url + 'TblCity/GetCities').pipe(
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

  addArea(model:any){
    
      const fromData=new FormData();
      fromData.append('CityNameAr',model.CityNameAr);                         
      fromData.append('Governorate',model.Governorate);                           
      fromData.append('NoCity',model.noCity);
     
  
      return this.http.post(this.url+"TblCity/AddNewCity",fromData).pipe(
        map((value:any) =>
        {

        })
        );
    }
  
    editArea(model: any): Observable<any> {
      const formData = new FormData();
      formData.append('CityID', model.CityID);
      formData.append('CityNameAr', model.CityNameAr);
      formData.append('Governorate', model.Governorate);
      formData.append('NoCity', model.NoCity);

      
      
      return this.http.put(this.url + 'TblCity/EditCity', formData).pipe(
        map((res: any) => {
          this.toster.success('تم تعديل :) ');
          this.getAllarae().subscribe(); // Update all customers after editing

          return res;
        }),
        catchError((err) => {
          if (err.status === 200) {
            this.toster.success('تم التعديل :) ');
            this.getAllarae().subscribe(); // Update all customers after editing

          } else {
            this.toster.error('لم يتم التعديل');
          }
          throw err;
        })
      );
    }

    deleteFaults(id: number): Observable<any> {
      return this.http.delete(this.url + 'TblCity/DeleteCity/' + id).pipe(
        map((res: any) => {
          this.toster.success('تم الحذف :) ');
          this.getAllarae().subscribe(() => {
            this.updateData();
          });
          return res;
        }),
        catchError((err) => {
          if (err.status === 200) {
            this.toster.success('تم الحذف :) ');
            this.getAllarae().subscribe(() => {
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