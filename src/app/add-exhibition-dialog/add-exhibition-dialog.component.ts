import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExhibitionUserService } from 'app/services/exhibition-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-add-exhibition-dialog',
    templateUrl: './add-exhibition-dialog.component.html',
    styleUrls: ['./add-exhibition-dialog.component.scss']
})
export class AddExhibitionDialogComponent implements OnInit {

    exhibitionForm!: FormGroup;
    url = environment.baseUrl;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddExhibitionDialogComponent>,
        private http: HttpClient,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        this.exhibitionForm = this.fb.group({
            exhibitionIDNmAr: ['', Validators.required],
            mobile1: [''],
            mobile2: [''],
            address: ['']
        });
    }

    onSubmit(): void {
        if (this.exhibitionForm.valid) {
            this.spinner.show();

            this.http.post(this.url + 'Tbl_Exhibition/AddExhibition', this.exhibitionForm.value).subscribe({
                next: (response) => {
                    this.spinner.hide();
                    this.toastr.success('تم إضافة المعرض بنجاح');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.spinner.hide();
                    if (err.status === 200) {
                        this.toastr.success('تم إضافة المعرض بنجاح');
                        this.dialogRef.close(true);
                    } else {
                        this.toastr.error('لم تتم إضافة المعرض');
                    }
                }
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
