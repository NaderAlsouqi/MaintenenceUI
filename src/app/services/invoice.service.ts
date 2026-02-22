import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    url = environment.baseUrl + 'TblInvoice/';

    constructor(private http: HttpClient) { }

    createInvoice(invoice: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(this.url + 'CreateInvoice', invoice, { headers: headers });
    }

    getInvoices(): Observable<any[]> {
        return this.http.get<any[]>(this.url + 'GetInvoices');
    }

    getInvoiceById(id: number): Observable<any> {
        return this.http.get<any>(this.url + 'GetInvoice/' + id);
    }

    deleteInvoice(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.url + 'DeleteInvoice/' + id);
    }
}
