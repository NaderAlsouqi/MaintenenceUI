import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AttachmentService } from '../services/attachment.service'; // Import your AttachmentService

@Component({
  selector: 'app-view-attachments-dialog',
  templateUrl: './view-attachments-dialog.component.html',
  styleUrls: ['./view-attachments-dialog.component.scss']
})

export class ViewAttachmentsDialogComponent implements OnInit {
  displayedColumns: string[] = ['fileName', 'contentType', 'description', 'uploadDate', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ViewAttachmentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { introId: number },
    private attachmentService: AttachmentService // Inject the AttachmentService
  ) { }

  ngOnInit(): void {
    // Retrieve attachments based on introId
    this.attachmentService.getAttachmentsByIntroID(this.data.introId).subscribe(attachments => {
      this.dataSource = new MatTableDataSource(attachments);
      this.dataSource.sort = this.sort; // Assign the sorting to the dataSource
    });
  }

  // Function to download an attachment
  downloadAttachment(attachment: any): void {
    this.attachmentService.downloadAttachment(attachment.id).subscribe(data => {
      // Create a blob from the binary data and create a URL for the blob
      const blob = new Blob([data], { type: attachment.contentType });
      const url = window.URL.createObjectURL(blob);
      
      // Create a hidden anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Function to delete an attachment
  deleteAttachment(attachment: any): void {
    if (confirm(`Are you sure you want to delete "${attachment.fileName}"?`)) {
      this.attachmentService.deleteAttachment(attachment.id).subscribe(result => {
        if (result) {
          // Reload the data source to reflect the deleted attachment
          this.attachmentService.getAttachmentsByIntroID(this.data.introId).subscribe(attachments => {
            this.dataSource.data = attachments;
          });
        } else {
        }
      });
    }
  }

  // Function to apply the general filter
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase(); // Remove whitespace and convert to lowercase
    this.dataSource.filter = filterValue;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
