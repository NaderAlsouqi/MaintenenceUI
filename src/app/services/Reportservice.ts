import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  constructor(
    private http: HttpClient,
    private toster: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  url = environment.baseUrl;

  GeneratePdf_customer() {
    return this.http.get(this.url + 'Report/GeneratePdf_customer', { observe: 'response', responseType: 'blob' })
  }

  GeneratePdf_Exhibition() {
    return this.http.get(this.url + 'Report/GeneratePdf_Exhibition', { observe: 'response', responseType: 'blob' })
  }

  GeneratePdf_Faults() {
    return this.http.get(this.url + 'Report/GeneratePdf_Faults', { observe: 'response', responseType: 'blob' })
  }

  GeneratePdf_Cities() {
    return this.http.get(this.url + 'Report/GeneratePdf_Cities', { observe: 'response', responseType: 'blob' })
  }
  GeneratePdf_DeviceDEC() {
    return this.http.get(this.url + 'Report/GeneratePdf_DeviceDEC', { observe: 'response', responseType: 'blob' })
  }

  GeneratePdf_Warehouses() {
    return this.http.get(this.url + 'Report/GeneratePdf_Warehouses', { observe: 'response', responseType: 'blob' })
  }


  GeneratePdf_Item() {
    return this.http.get(this.url + 'Report/GeneratePdf_Item', { observe: 'response', responseType: 'blob' })
  }
  GeneratePdf_User() {
    return this.http.get(this.url + 'Report/GeneratePdf_User', { observe: 'response', responseType: 'blob' })
  }
  GeneratePdf_Device() {
    return this.http.get(this.url + 'Report/GeneratePdf_Device', { observe: 'response', responseType: 'blob' })
  }

  GeneratePdf_Driver() {
    return this.http.get(this.url + 'Report/GeneratePdf_Driver', { observe: 'response', responseType: 'blob' })
  }

  BillPdf() {
    return this.http.get(this.url + 'Report/BillPdf', { observe: 'response', responseType: 'blob' })
  }

  BillStatusPdf() {
    return this.http.get(this.url + 'Report/BillStatusPdf', { observe: 'response', responseType: 'blob' })
  }

  ViewBillStatusPdf(id: number) {
    return this.http.get(`${this.url}Report/ViewBillStatusPdf?id=${id}`, { observe: 'response', responseType: 'blob' });
  }

  MaintenanceIntroByIdPdf(id: number) {
    return this.http.get(`${this.url}Report/MaintenanceIntroByIdPdf?id=${id}`, { observe: 'response', responseType: 'blob' })
  }

  MaintenanceRequests(dataList: any) {
    // Assuming this.url is correctly defined earlier in your class
    return this.http.post(this.url + 'Report/MaintenanceRequests', dataList, {
      observe: 'response',
      responseType: 'blob' // We expect a blob (PDF) as the response
    });
  }

  GetScheduled_MaintenancPdf(dataList: any) {
    return this.http.post(this.url + 'Report/scheduledMaintenance', dataList, {
      observe: 'response',
      responseType: 'blob' // We expect a blob (PDF) as the response
    });
  }

  MaintenanceManager(dataList: any) {
    // Assuming this.url is correctly defined earlier in your class
    return this.http.post(this.url + 'Report/MaintenanceManager', dataList, {
      observe: 'response',
      responseType: 'blob', // We expect a blob (PDF) as the response
      withCredentials: true // Include credentials
    });
  }

  MaintenanceTechnician(dataList: any) {
    // Assuming this.url is correctly defined earlier in your class
    return this.http.post(this.url + 'Report/MaintenanceTechnician', dataList, {
      observe: 'response',
      responseType: 'blob' // We expect a blob (PDF) as the response
    });
  }

  Enquiry(dataList: any) {
    // Assuming this.url is correctly defined earlier in your class
    return this.http.post(this.url + 'Report/Enquiry', dataList, {
      observe: 'response',
      responseType: 'blob' // We expect a blob (PDF) as the response
    });
  }

  AfterMaintenance() {
    return this.http.get(this.url + 'Report/AfterMaintenance', { observe: 'response', responseType: 'blob' })
  }

}