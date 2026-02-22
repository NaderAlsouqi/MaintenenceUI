import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaxService {

    url = environment.baseUrl + 'Tax/';

    constructor(private http: HttpClient) { }

    saveTax(tax: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(this.url + 'SaveTax', tax, { headers: headers });
    }

    getTaxes(): Observable<any[]> {
        return this.http.get<any[]>(this.url + 'GetTaxes');
    }

    deleteTax(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.url + 'DeleteTax/' + id);
    }
}
