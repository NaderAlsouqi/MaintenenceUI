import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-technician-user-dialog',
    templateUrl: './add-technician-user-dialog.component.html',
    styleUrls: ['./add-technician-user-dialog.component.scss']
})
export class AddTechnicianUserDialogComponent implements OnInit {
    hide = true;
    loginType = '1';
    User_Statuss: any[] = [{ 'value': 1, 'name': 'فعال' }, { 'value': 2, 'name': 'غير فعال' }];
    addNewUserForm!: FormGroup;
    currentDate: any;

    constructor(private fb: FormBuilder, private user: UserService,
        private toster: ToastrService, private spinner: NgxSpinnerService,
        public dialogRef: MatDialogRef<AddTechnicianUserDialogComponent>) { }

    ngOnInit(): void {
        this.currentDate = new Date();
        this.addNewUserForm = this.fb.group({
            userNmAr: ['', Validators.required],
            password: ['', Validators.required],
            name_User_level: ['فني', Validators.required], // Hardcoded
            user_level: [3], // Hardcoded
            name_relation_level: ['Admin'], // Default
            email: ['', [Validators.required, Validators.email]],
            loginType: ['', Validators.required],
            transDate: [''],
        });

        // Default status
        this.addNewUserForm.get('loginType').setValue(1);
    }

    onEmergencyStatusChange(event: any) {
        const selectedStatus = event.value;
        if (selectedStatus === 'فعال') {
            this.addNewUserForm.controls.loginType.setValue(1);
        } else if (selectedStatus === 'غير فعال') {
            this.addNewUserForm.controls.loginType.setValue(2);
        }
    }

    AddUser() {
        const formattedDate = this.currentDate.toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
        this.addNewUserForm.get('transDate').setValue(formattedDate);

        // Ensure role matches before submit
        this.addNewUserForm.patchValue({
            name_User_level: 'فني',
            user_level: 3
        });

        this.user.addUser(this.addNewUserForm.value).subscribe(() => {
            this.toster.success("تم اضافة فني جديد");
            setTimeout(() => {
                this.spinner.hide();
                this.dialogRef.close();
            }, 1000);
        }, error => {
            if (error.status == 200) {
                this.toster.success("تم اضافة فني جديد");
                setTimeout(() => {
                    this.spinner.hide();
                    this.dialogRef.close();
                }, 1000);
            } else {
                this.toster.error("لم يتم الاضافة");
                this.spinner.hide();
            }
        });
    }

    onSubmit() {
        this.spinner.show();
        this.AddUser();
    }
}
