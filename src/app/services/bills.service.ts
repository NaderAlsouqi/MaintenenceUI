import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, map, tap } from 'rxjs';

import { MaintenanceManagerService } from './maintenance-manager.service';

@Injectable({
  providedIn: 'root'
})
export class BillsService {
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
    private Maintenance: MaintenanceManagerService) { }
  url = environment.baseUrl;

  getBills(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblBill/GetAllMaintIntro_Bill_list').pipe(
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

  getBillStatus(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblBill/GetBillStatus').pipe(
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

  getBills_list(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblBill/GetBills_list').pipe(
      tap((res: any) => {
        this.spinner.hide();
      }),
      catchError((err) => {
        this.spinner.hide();
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  getBillById(id: number): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblBill/GetBill/' + id).pipe(
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

  GetDataWarehouse(id: number): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblWarehouse/GetDataWarehouse/' + id).pipe(
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

  deleteMaintenance(id: number): Observable<any> {
    return this.http.delete(this.url + 'TblMaintenance/DeleteMaintenance/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف :) ');
        this.router.navigate(['/maintenanceTechnician']);

        this.Maintenance.GetAllMaintIntro().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.router.navigate(['/maintenanceTechnician']);

          this.Maintenance.GetAllMaintIntro().subscribe(() => {

            this.updateData();
          });
        } else {
          this.toster.error('لم تتم عملية الحذف');
        }
        throw err;
      })
    );
  }

  DeleteBill(id: number): Observable<any> {
    return this.http.delete(this.url + 'Tbl_dateStart/DeleteBill/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف:) ');
        this.router.navigate(['/bills']);

        this.getBills().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.router.navigate(['/bills']);

          this.getBills().subscribe(() => {

            this.updateData();
          });
        } else {
          this.toster.error('لم يتم الحذف');
        }
        throw err;
      })
    );
  }

  saveWarehouse(model: any): Observable<any> {
    const fromData = new FormData();
    fromData.append('intro_id', model.intro_id);
    fromData.append('warehouseNo', model.warehouseNo);
    fromData.append('piece_number', model.piece_number);
    fromData.append('Desc_Piece', model.Desc_Piece);
    fromData.append('Price', model.Price);
    fromData.append('disc', model.disc);
    fromData.append('Count_pieces', model.Count_pieces);
    fromData.append('model', null)

    //  this.url = "https://localhost:7055/api/"

    return this.http.post(this.url + 'TblWarehouse/Savewarehouse', fromData).pipe(
      map((res: any) => {
        // Process the response if needed
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  deleteWarehousePart(intro_id: number, piece_number: number): Observable<any> {
    return this.http.delete(this.url + 'TblWarehouse/DeleteWarehousePart/' + intro_id + '/' + piece_number, { responseType: 'text' }).pipe(
      map((res: any) => {
        this.toster.success('تم حذف القطعة بنجاح');
        return res;
      }),
      catchError((err) => {
        this.toster.error('لم يتم حذف القطعة');
        throw err;
      })
    );
  }

  GetMaintenanceId(id: number): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenanceIntro/GetMaintenanceIntro/' + id)
      .pipe(
        tap((res: any) => {
          this.spinner.hide();
          // this.toster.success('Data Returned');
        }),
        catchError((err) => {
          if (err.status === 200) {
            // this.toster.success('Updated Successfully :) ');

          } else {
            // this.toster.error('Something went wrong');
          }
          throw err;
        }
        )

      );

  }

  GetMaintenanceIdSilent(id: number): Observable<any> {
    // No spinner.show() here
    return this.http.get(this.url + 'TblMaintenanceIntro/GetMaintenanceIntro/' + id)
      .pipe(
        tap((res: any) => {
          // No spinner.hide() needed
        }),
        catchError((err) => {
          // Handle error silently or just throw
          throw err;
        })
      );
  }

  editSavemaintenance(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('intro_id', model.intro_id);
    if (typeof model.Request_statues === 'number')
      formData.append('Request_statues', model.Request_statues);
    else if (typeof model.Request_statues === 'object')
      formData.append('Request_statues', model.Request_statues.value);
    formData.append('DeviceSR', model.DeviceSR);
    formData.append('Defects_detected', model.Defects_detected);
    formData.append('Desc_technical', model.Desc_technical);
    formData.append('start_Time', model.start_Time);
    formData.append('start_date', model.start_date);
    formData.append('General_Desc', model.General_Desc);

    return this.http.put(this.url + 'TblWarehouse/Savemaintenance', formData).pipe(
      map((res: any) => {
        this.toster.success('نم تعديل الطلب:) ');

        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم تعديل الطلب :) ');

        } else {
          this.toster.error('لم يتم تعديل الطلب');
        }
        throw err;
      })
    );
  }

  addBill(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('intro_id', model.intro_id);
    formData.append('IDBill', model.idBill);
    formData.append('dateBill', model.dateBill);
    formData.append('dis', model.dis);
    formData.append('tott', model.tott);
    formData.append('Workers', model.workers);
    formData.append('tax', model.tax);
    formData.append('tot_bill', model.tot_bill);

    return this.http.post(this.url + 'TblMaintenance/AddBill', formData).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  SaveDateTime(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('intro_id', model.intro_id);
    formData.append('start_Time', model.start_Time);
    formData.append('start_date', model.start_date);


    return this.http.post(this.url + 'Tbl_dateStart/SaveDateTime', formData).pipe(
      map((res: any) => {
        // Process the response if needed
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  getBillDetails(fromDate: string, toDate: string, statusName: string): Observable<any> {
    let params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('statusName', statusName);

    return this.http.get(`${this.url}TblBill/GetBillDetails`, { params });
  }

  billUpdateStatus(billIds: number[], newStatus: string): Observable<any> {
    // Construct the payload or query parameters as required by your API
    const payload = { billIds, newStatus };

    // Replace 'updateStatusEndpoint' with your actual API endpoint
    return this.http.post(`${this.url}TblBill/UpdateBillStatus`, payload);
  }

  saveMaintenanceSimple(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('intro_id', String(model.intro_id || ''));

    // Check lowercase 'request_statues' from form, fall back to 'Request_statues' if needed
    const requestStatus = model.request_statues !== undefined ? model.request_statues : model.Request_statues;

    // Convert to string for FormData
    if (typeof requestStatus === 'number') {
      formData.append('Request_statues', String(requestStatus));
    } else if (typeof requestStatus === 'string') {
      formData.append('Request_statues', requestStatus);
    } else if (requestStatus && typeof requestStatus === 'object' && requestStatus.value) {
      formData.append('Request_statues', String(requestStatus.value));
    }

    // Check lowercase 'general_Desc' from form, fall back to 'General_Desc'
    const generalDesc = model.general_Desc !== undefined ? model.general_Desc : model.General_Desc;
    formData.append('General_Desc', String(generalDesc || ''));

    // Use TblWarehouse/Savemaintenance as requested (PUT method to match editSavemaintenance)
    return this.http.put(this.url + 'TblWarehouse/Savemaintenance', formData).pipe(
      map((res: any) => {
        this.toster.success('تم الحفظ :) ');
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحفظ :) ');
        } else {
          this.toster.error('لم يتم الحفظ');
        }
        throw err;
      })
    );
  }

}

