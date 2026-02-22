import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReceiptService {

    url = environment.baseUrl + 'Receipt/';

    constructor(private http: HttpClient) { }

    saveReceipt(receipt: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(this.url + 'SaveReceipt', receipt, { headers: headers });
    }

    getReceiptsByInvoiceId(invoiceId: number): Observable<any[]> {
        return this.http.get<any[]>(this.url + 'GetReceiptsByInvoiceId/' + invoiceId);
    }

    getAllReceipts(): Observable<any[]> {
        return this.http.get<any[]>(this.url + 'GetAllReceipts');
    }

    deleteReceipt(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.url + 'DeleteReceipt/' + id);
    }
}
