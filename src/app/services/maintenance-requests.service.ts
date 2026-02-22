import { HttpClient } from '@angular/common/http';
import { Injectable, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddmaintenancerequestsComponent } from 'app/add-maintenance-requests/add-maintenance-requests.component';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestsService {

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


  getAllDeviceDEC(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'Tbl_Device/GetAllDeviceDEC').pipe(
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


  CheckDeviceDECType(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'Tbl_Device/CheckDeviceDECType').pipe(
      tap((res: any) => {
        this.spinner.hide();
        // this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        // this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }


  CheckDeviceDECModel_ID(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'Tbl_Device/CheckDeviceDECModel_ID').pipe(
      tap((res: any) => {
        this.spinner.hide();
        // this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        //    this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }


  LoadHistoryData(search: any): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'Tbl_Device/LoadHistoryData', { params: { customersNum: search } }).pipe(
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

  Deleterequest(id: number): Observable<any> {
    return this.http.delete(this.url + 'TblMaintenanceIntro/DeleteMaintenanceIntro/' + id).pipe(
      map((res: any) => {
        this.toster.success('DeleteFaults Successfully :) ');
        this.LoadHistoryData('initialGet').subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.LoadHistoryData('initialGet').subscribe(() => {
            this.updateData();
          });
        } else {
          this.toster.error('لم يتم الحذف');
        }
        throw err;
      })
    );
  }


  EditDeviceDEC(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('id', model.id);
    formData.append('deviceModel_ID', model.deviceModel_ID);
    formData.append('deviceModel_Name', model.deviceModel_Name);
    formData.append('devicePor', model.devicePor);
    formData.append('devicePro_ID', model.devicePro_ID);
    formData.append('deviceType_ID', model.deviceType_ID);
    formData.append('deviceType_Name', model.deviceType_Name);



    return this.http.put(this.url + 'Tbl_Device/EditDeviceDEC', formData).pipe(
      map((res: any) => {
        this.toster.success('تم تعديل :) ');
        this.getAllDeviceDEC().subscribe(); // Update all customers after editing

        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
          this.getAllDeviceDEC().subscribe(); // Update all customers after editing

        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  DeleteDeviceDEC(id: number): Observable<any> {
    return this.http.delete(this.url + 'Tbl_Device/DeleteDeviceDEC/' + id).pipe(
      map((res: any) => {
        this.toster.success('DeleteFaults Successfully :) ');
        this.getAllDeviceDEC().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.getAllDeviceDEC().subscribe(() => {
            this.updateData();
          });
        } else {
          this.toster.error('لم يتم الحذف');
        }
        throw err;
      })
    );
  }

  AddNewDeviceDEC(model: any): Observable<any> {
    const data = {
      devicePro_ID: String(model.devicePro_ID || ''),
      devicePor: String(model.devicePor || ''),
      deviceType_ID: String(model.deviceType_ID || ''),
      deviceType_Name: String(model.deviceType_Name || ''),
      deviceModel_ID: String(model.deviceModel_ID || ''),
      deviceModel_Name: String(model.deviceModel_Name || '')
    };

    return this.http.post(this.url + 'Tbl_Device/AddNewDeviceDEC', data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
  GetLastIntroID() {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenanceIntro/SelectMax').pipe(
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

  getExhibition(): Observable<any> {
    this.spinner.show(); // Show the spinner

    return this.http.get(this.url + 'Tbl_Exhibition/GetExhibition').pipe(
      tap((res: any) => {
        this.spinner.hide(); // Hide the spinner
        //this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide(); // Hide the spinner
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  getDistinctDeviceProduct(): Observable<any> {
    this.spinner.show(); // Show the spinner

    return this.http.get(this.url + 'Tbl_Device/SelectDistinctDevicePro').pipe(
      tap((res: any) => {
        this.spinner.hide(); // Hide the spinner
        // this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide(); // Hide the spinner
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  getDistinctDeviceType(devicePro_ID: any): Observable<any> {
    this.spinner.show(); // Show the spinner

    return this.http.get(this.url + 'Tbl_Device/filter_Type', { params: { devicePro_ID: devicePro_ID } }).pipe(
      tap((res: any) => {
        this.spinner.hide(); // Hide the spinner
        //this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide(); // Hide the spinner
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  getDistinctDeviceModel(devicePro_ID: any, deviceType_ID: any): Observable<any> {
    this.spinner.show(); // Show the spinner

    return this.http.get(this.url + 'Tbl_Device/filter_deviceModel', { params: { devicePro_ID: devicePro_ID, deviceType_ID: deviceType_ID } }).pipe(
      tap((res: any) => {
        this.spinner.hide(); // Hide the spinner
        //this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide(); // Hide the spinner
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  GetCustomers_data(customersNum: any): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblCustomer/GetCustomers_data/' + customersNum).pipe(
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

  addIntro(model: any): Observable<any> {
    let intro_Emergency = 0;
    if (model.intro_Emergency === 'غير طارئة') {
      intro_Emergency = 1;
    } else if (model.intro_Emergency === 'صيانة طارئة') {
      intro_Emergency = 0;
    } else {
      intro_Emergency = Number(model.intro_Emergency) || 0;
    }

    let intro_InOut = 0;
    if (model.intro_InOut === 'داخلية') {
      intro_InOut = 0;
    } else if (model.intro_InOut === 'خارجية') {
      intro_InOut = 1;
    } else {
      intro_InOut = Number(model.intro_InOut) || 0;
    }

    let status_Intro = '0';
    if (model.status_Intro == 'مشكوك') {
      status_Intro = '0';
    } else if (model.status_Intro == 'غير مكفول') {
      status_Intro = '1';
    } else if (model.status_Intro == 'مكفول') {
      status_Intro = '2';
    } else {
      status_Intro = String(model.status_Intro || '0');
    }

    // Format datePurchase
    const datePurchase = new Date(model.datePurchase);
    const formattedDatePurchase = `${datePurchase.getDate()}/${datePurchase.getMonth() + 1}/${datePurchase.getFullYear()}`;

    const data = {
      intro_date: model.intro_date,
      intro_Emergency: intro_Emergency,
      CustomersNum: Number(model.CustomersNum) || 0,
      intro_InOut: intro_InOut,
      ExhibitionID: Number(model.ExhibitionID) || 0,
      DeviceSR: String(model.DeviceSR || '0'),
      intro_damage: model.intro_damage,
      intro_disc: model.intro_disc,
      deviceType_ID: Number(model.deviceType_ID) || 0,
      deviceType_Name: model.deviceType_Name,
      deviceModel_ID: Number(model.deviceModel_ID) || 0,
      deviceModel_Name: model.deviceModel_Name,
      devicePro_ID: Number(model.devicePro_ID) || 0,
      devicePor: model.devicePor,
      intro_discT: model.intro_discT,
      barcode: model.barcode,
      datePurchase: formattedDatePurchase,
      insert_By: Number(model.insert_By) || 0,
      status_Intro: status_Intro,
      status_Intro_Name: model.status_Intro_Name || '',
      CountDevise: String(model.CountDevise || '')
    };

    return this.http.post(this.url + 'TblMaintenanceIntro/AddNewMaintenanceIntro', data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  editIntro(model: any): Observable<any> {
    const data = {
      intro_id: Number(model.intro_id) || 0,
      intro_date: model.intro_date,
      intro_Emergency: Number(model.intro_Emergency) || 0,
      CustomersNum: Number(model.customersNum) || 0,
      intro_InOut: Number(model.intro_InOut) || 0,
      ExhibitionID: Number(model.exhibitionID) || 0,
      intro_damage: model.intro_damage,
      intro_disc: model.intro_disc,
      intro_discT: model.intro_discT,
      datePurchase: model.datePurchase,
      insert_By: Number(model.insert_By) || 0,
      barcode: model.barcode,
      deviceType_ID: Number(model.deviceType_ID) || 0,
      deviceType_Name: model.deviceType_Name,
      deviceModel_ID: Number(model.deviceModel_ID) || 0,
      deviceModel_Name: model.deviceModel_Name,
      devicePro_ID: Number(model.devicePro_ID) || 0,
      devicePor: model.devicePor,
      status_Intro: Number(model.status_Intro) || 0,
      status_Intro_Name: model.status_Intro_Name || '',
      CountDevise: String(model.CountDevise || model.countDevice || '')
    };

    return this.http.put(this.url + 'TblMaintenanceIntro/EditeMaintenanceIntro', data).pipe(
      map((res: any) => {
        this.toster.success('تم التعديل:) ');
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }
  EditeRequest(model2: any): Observable<any> {
    const data = {
      id: Number(model2.id) || 0
    };

    return this.http.put(this.url + 'TblMaintenanceIntro/EditeRequest', data).pipe(
      map((res: any) => {
        this.toster.success('تم التعديل :) ');
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }
  addDevicePor(model: any) {

    const fromData = new FormData();
    fromData.append('devicePor', model.product);

    return this.http.post(this.url + "Tbl_Device/AddNewdevicePor", fromData).pipe(
      map((value: any) => {

      })
    );
  }

  addDeviceType(model: any) {

    const fromData = new FormData();
    fromData.append('devicePor', model.devicePor1);
    fromData.append('devicePro_ID', model.devicePro_ID);
    fromData.append('deviceType_Name', model.deviceType_Name1);

    return this.http.post(this.url + "Tbl_Device/AddNewdeviceType", fromData).pipe(
      map((value: any) => {

      })
    );
  }

  addNewdeviceModel(model: any) {

    const fromData = new FormData();
    fromData.append('devicePor', model.devicePor);
    fromData.append('devicePro_ID', model.devicePro_ID1);
    fromData.append('deviceType_Name', model.deviceType_Name);
    fromData.append('deviceType_ID', model.deviceType_ID);
    fromData.append('deviceModel_Name', model.deviceModel_Name);

    return this.http.post(this.url + "Tbl_Device/AddNewdeviceModel", fromData).pipe(
      map((value: any) => {

      })
    );
  }

  EditNewdeviceModel(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('id', model.id);
    formData.append('deviceModel_ID', model.deviceModel_ID);
    formData.append('deviceModel_Name', model.deviceModel_Name);
    formData.append('devicePor', model.devicePor);
    formData.append('devicePro_ID', model.devicePro_ID);
    formData.append('deviceType_ID', model.deviceType_ID);
    formData.append('deviceType_Name', model.deviceType_Name);



    return this.http.put(this.url + 'Tbl_Device/EditNewdeviceModel', formData).pipe(
      map((res: any) => {
        //  this.toster.success('تم تعديل :) ');
        this.getAllDeviceDEC().subscribe(); // Update all customers after editing

        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          //this.toster.success('تم التعديل :) ');
          this.getAllDeviceDEC().subscribe(); // Update all customers after editing

        } else {
          // this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }


  EditNewdeviceType(model: any): Observable<any> {
    const formData = new FormData();
    formData.append('id', model.id);
    formData.append('devicePor', model.devicePor1);
    formData.append('devicePro_ID', model.devicePro_ID);
    formData.append('deviceType_ID', model.deviceType_ID);
    formData.append('deviceType_Name', model.deviceType_Name1);



    return this.http.put(this.url + 'Tbl_Device/EditNewdeviceType', formData).pipe(
      map((res: any) => {
        //  this.toster.success('تم تعديل :) ');
        this.getAllDeviceDEC().subscribe(); // Update all customers after editing

        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          //   this.toster.success('تم التعديل :) ');
          this.getAllDeviceDEC().subscribe(); // Update all customers after editing

        } else {
          // this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  GetMaintenanceIntroCounts() {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenanceIntro/MaintenanceIntroCountsDashboard').pipe(
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

  GetMonthlyIntroCounts() {
    this.spinner.show();
    return this.http.get(this.url + 'TblMaintenanceIntro/GetMonthlyIntroCounts').pipe(
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

}

