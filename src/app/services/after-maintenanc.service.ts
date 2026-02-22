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
export class AfterMaintenancService {

    private dataUpdatedSource = new Subject<void>();
    dataUpdated$ = this.dataUpdatedSource.asObservable();
  
    updateData() {
      this.dataUpdatedSource.next();
    }
  constructor(
    private http: HttpClient,
    private router: Router,
    private toster: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  allAfterMaintenanc: any;
  url = environment.baseUrl;

  GetFollowMaintList(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenanceIntro/GetFollowMaintList').pipe(
      tap((res: any) => {
        this.allAfterMaintenanc = res;
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

  deletFollow_maint(id: number): Observable<any> {
    return this.http.delete(this.url + 'TblFollowMaint/DeletFollowMaint/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف :) ');
        this.router.navigate(['/after-maintenance']);

        this.GetFollowMaintList().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.router.navigate(['/after-maintenance']);

          this.GetFollowMaintList().subscribe(() => {

            this.updateData();
          });
        } else {
          this.toster.error('لم يقم بالحذف');
        }
        throw err;
      })
    );
  }
  
  saveFollowMaint(model:any){
    
    const fromData=new FormData();
    fromData.append('desc',model.disc);                           
    fromData.append('CustomersNum',model.CustomersNum);                           
    fromData.append('DeviceSR',model.deviceSR);
    fromData.append('intro_id',model.intro_id);

    return this.http.post(this.url+"TblFollowMaint/SaveFollowMaint",fromData).pipe(
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