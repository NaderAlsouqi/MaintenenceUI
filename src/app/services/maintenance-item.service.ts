import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MaintenanceItemService {

    url = environment.baseUrl + 'TblMaintenanceItem/';

    constructor(private http: HttpClient) { }

    addMaintenanceItem(item: any): Observable<any> {
        return this.http.post(this.url + 'AddMaintenanceItem', item);
    }

    getMaintenanceItems(maintenanceId: number): Observable<any[]> {
        return this.http.get<any[]>(this.url + 'GetMaintenanceItems/' + maintenanceId);
    }

    deleteMaintenanceItem(id: number): Observable<any> {
        return this.http.delete(this.url + 'DeleteMaintenanceItem/' + id);
    }
}
