import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  url=environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllAttachments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}Attachment/GetAllAttachments`);
  }

  getAttachmentsByIntroID(introID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}Attachment/GetAttachmentsByIntroID/${introID}`);
  }

  downloadAttachment(attachmentID: number): Observable<Blob> {
    return this.http.get(`${this.url}Attachment/DownloadAttachment/${attachmentID}`, {
      responseType: 'blob'
    });
  }

  deleteAttachment(attachmentID: number): Observable<boolean> {
    return this.http.delete(`${this.url}Attachment/DeleteAttachmentByID/${attachmentID}`, { observe: 'response' }).pipe(
      map(response => response.status === 200),
    );
  }
  
  // Function to upload an attachment
  uploadAttachment(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}Attachment/UploadAttachment`, formData);
  }
}
