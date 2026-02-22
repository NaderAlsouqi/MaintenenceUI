import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, catchError, map, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
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

  url = environment.baseUrl;

  getAlluser(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblCustomer/GetCustomers').pipe(
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

  GetFault(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'TblFault/GetFaults').pipe(
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
  GetFaultsLocation(Address: string): Observable<any> {
    const formData = new FormData();
    formData.append('Address', Address)
    this.spinner.show();
    return this.http.get(this.url + `TblCity/GetCitiesLocation/${Address}`).pipe(
      tap((res: any) => {
        this.spinner.hide();
        //   this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  addCustomer(model: any): Observable<any> {
    debugger;
    const formData = new FormData();
    formData.append('CustomersNum', model.CustomersNum);
    formData.append('Customers_FName', model.Customers_FName);
    formData.append('Customers_LName', model.Customers_LName);
    formData.append('Customers_PName', model.Customers_PName);
    formData.append('Customers_FaName', model.Customers_FaName);
    formData.append('Customers_phone1', model.Customers_phone1);
    formData.append('Customers_phone2', model.Customers_phone2);
    formData.append('Customers_Address', model.Customers_Address);
    formData.append('Customers_email', model.Customers_email);
    formData.append('Customers_Status', model.Customers_Status.value);



    formData.append('Customers_bank', model.Customers_bank);
    formData.append('Customers_ACC', model.Customers_ACC);
    formData.append('Customers_Pic', model.Customers_Pic);
    formData.append('Customers_Address1', model.Customers_Address1);
    formData.append('Customers_Address2', model.Customers_Address2);
    formData.append('Customers_AddressName', model.Customers_AddressName);
    formData.append('LocationLatitude', model.LocationLatitude);
    formData.append('LocationLongitude', model.LocationLongitude);
    return this.http.post(this.url + 'TblCustomer/AddNewCustomers', formData).pipe(
      map((res: any) => {
        // Process the response if needed
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  editCustomer(model: any): Observable<any> {
    // checking if we have Phone2 
    if (model.Customers_phone2 == 0 || model.Customers_phone2 == null) {
      model.Customers_phone2 = '';
    }
    // checking if we have الشارع
    if (model.Customers_Address == 0 || model.Customers_Address == null) {
      model.Customers_Address = "غير متوفر";
    }
    // checking if we have اللواء
    if (model.Customers_Address1 == 0 || model.Customers_Address1 == null) {
      model.Customers_Address1 = "غير متوفر";
    }
    // checking if we have الحي 
    if (model.Customers_Address2 == 0 || model.Customers_Address2 == null) {
      model.Customers_Address2 = "غير متوفر";
    }
    // checking if we have Picture 
    if (model.Customers_Pic == '' || model.Customers_Pic == null) {
      model.Customers_Pic = "null";
    }
    // checking if we have Customers_bank 
    if (model.Customers_bank == '' || model.Customers_bank == null) {
      model.Customers_bank = 'null';
    }
    // checking if we have Customers_PName
    if (model.Customers_PName == '' || model.Customers_PName == null) {
      model.Customers_PName = 'null';
    }
    // checking if we have Customers_FName
    if (model.Customers_FName == '' || model.Customers_FName == null) {
      model.Customers_FName = 'null';
    }
    // checking if we have Customers_LName
    if (model.Customers_LName == '' || model.Customers_LName == null) {
      model.Customers_LName = 'null';
    }
    // checking if we have Customers_FaName
    if (model.Customers_FaName == '' || model.Customers_FaName == null) {
      model.Customers_FaName = 'null';
    }

    const formData = new FormData();
    formData.append('CustomersID', model.CustomersID);
    formData.append('CustomersNum', model.CustomersNum);
    formData.append('Customers_FName', model.Customers_FName);
    formData.append('Customers_LName', model.Customers_LName);
    formData.append('Customers_PName', model.Customers_PName);
    formData.append('Customers_FaName', model.Customers_FaName);
    formData.append('Customers_phone1', model.Customers_phone1);
    formData.append('Customers_phone2', model.Customers_phone2);
    formData.append('Customers_Address', model.Customers_Address);
    formData.append('Customers_email', model.Customers_email);
    formData.append('Customers_Status', model.Customers_Status);
    formData.append('Customers_bank', model.Customers_bank);
    formData.append('Customers_ACC', model.Customers_ACC);
    formData.append('Customers_Pic', model.Customers_Pic);
    formData.append('Customers_Address1', model.Customers_Address1);
    formData.append('Customers_Address2', model.Customers_Address2);
    formData.append('Customers_AddressName', model.Customers_AddressName);
    formData.append('LocationLatitude', model.LocationLatitude);
    formData.append('LocationLongitude', model.LocationLongitude);
    return this.http.put(this.url + 'TblCustomer/EditCustomers', formData).pipe(
      map((res: any) => {
        this.toster.success('تم تعديل بيانات العميل :) ');
        this.getAlluser().subscribe(); // Update all customers after editing
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم تعديل بيانات العميل :) ');
          this.getAlluser().subscribe(); // Update all customers after editing
        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(this.url + 'TblCustomer/DeleteCustomers/' + id).pipe(
      map((res: any) => {
        this.toster.success('تم الحذف :) ');
        this.getAlluser().subscribe(() => {
          this.updateData();
        });
        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم الحذف :) ');
          this.getAlluser().subscribe(() => {
            this.updateData();
          });
        } else {
          this.toster.error('لم يتم الحذف');
        }
        throw err;
      })
    );
  }

  // Geolocation Methods
  searchLocation(query: string): Observable<any[]> {
    return this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
  }

  reverseGeocode(lat: number, lon: number): Observable<any> {
    return this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  }
}

