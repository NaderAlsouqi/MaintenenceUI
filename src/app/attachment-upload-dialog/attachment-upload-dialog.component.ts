import { Component, Inject, OnInit } from '@angular/core';
import { AttachmentService } from 'app/services/attachment.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/services/auth.service';


@Component({
  selector: 'app-attachment-upload-dialog',
  templateUrl: './attachment-upload-dialog.component.html',
  styleUrls: ['./attachment-upload-dialog.component.scss']
})
export class AttachmentUploadDialogComponent implements OnInit {

  attachmentDto = {
    description: '',
    introID: 0,
    UploadBy: 0,
    // You can include other fields as needed
  };

  selectedFile: File | null = null;

  constructor(private attachmentService: AttachmentService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<AttachmentUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public intro_id: number,
    ) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      // Create a FormData object
      const formData = new FormData();
      const introID = this.intro_id.toString(); // User ID
      const userId = this.auth.id; // User ID

      
      // Append the file
      formData.append('file', this.selectedFile, this.selectedFile.name);
  
      // Append metadata as form fields
      formData.append('description', this.attachmentDto.description);
      formData.append('introID', introID);
      formData.append('uploadBy', userId);
  
      // Pass the FormData to the service for uploading
      this.attachmentService.uploadAttachment(formData).subscribe(
        (response) => {
          // Handle success
  
          // Clear the form or perform any other necessary actions
          this.clearForm();
        },
        (error) => {
          // Handle error
        }
      );
    }
  }
  
  

  clearForm(): void {
    // Clear form fields and selected file
    this.attachmentDto = {
      description: '',
      introID: 0,
      UploadBy: 0,
      // Reset other fields as needed
    };
    this.selectedFile = null;
  }

  // Function to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
}
}

