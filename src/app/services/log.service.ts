import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private apiUrl = environment.baseUrl + 'Log';

    constructor(private http: HttpClient) { }

    getLogs(startDate?: string, endDate?: string, userId?: number): Observable<any[]> {
        let params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (userId) params.userId = userId;

        return this.http.get<any[]>(this.apiUrl + '/GetLogs', { params });
    }

    saveLog(log: any): Observable<any> {
        return this.http.post(this.apiUrl + '/SaveLog', log);
    }
}
