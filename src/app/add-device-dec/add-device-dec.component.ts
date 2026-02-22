import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-device-dec',
    templateUrl: './add-device-dec.component.html',
    styleUrls: ['./add-device-dec.component.scss']
})
export class AddDeviceDECComponent implements OnInit {
    addDeviceForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private requests: MaintenanceRequestsService,
        private toster: ToastrService,
        private spinner: NgxSpinnerService,
        public dialogRef: MatDialogRef<AddDeviceDECComponent>
    ) { }

    ngOnInit(): void {
        this.addDeviceForm = this.fb.group({
            devicePro_ID: [''],
            deviceType_ID: [''],
            deviceModel_ID: [''],
            devicePor: ['', Validators.required],
            deviceType_Name: [''],
            deviceModel_Name: [''],
        });
    }

    AddDeviceDEC() {
        this.requests.AddNewDeviceDEC(this.addDeviceForm.value).subscribe(() => {
            this.toster.success("تم إضافة الجهاز بنجاح");
            this.requests.updateData();
            this.spinner.hide();
            this.dialogRef.close();
        }, error => {
            if (error.status == 200) {
                this.toster.success("تم إضافة الجهاز بنجاح");
                this.requests.updateData();
                this.spinner.hide();
                this.dialogRef.close();
            } else {
                this.toster.error("لم يتم إضافة الجهاز");
                this.spinner.hide();
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.addDeviceForm.valid) {
            this.spinner.show();
            this.AddDeviceDEC();
        }
    }
}
