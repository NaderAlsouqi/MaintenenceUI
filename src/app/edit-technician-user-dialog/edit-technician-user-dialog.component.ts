import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-edit-technician-user-dialog',
    templateUrl: './edit-technician-user-dialog.component.html',
    styleUrls: ['./edit-technician-user-dialog.component.scss']
})
export class EditTechnicianUserDialogComponent implements OnInit {
    hide = true;
    editNewUserForm!: FormGroup;

    logIn_Statuss: any[] = [{ 'value': 1, 'name': 'فعال' }, { 'value': 2, 'name': 'غير فعال' }];

    constructor(private fb: FormBuilder,
        private user: UserService,
        private toster: ToastrService, private spinner: NgxSpinnerService,
        public dialogRef: MatDialogRef<EditTechnicianUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public users: any) { }

    ngOnInit(): void {
        this.editNewUserForm = this.fb.group({
            userID: [this.users.userID, Validators.required],
            userNmAr: [this.users.userNmAr, Validators.required],
            password: [this.users.password, Validators.required],
            name_User_level: [this.users.name_User_level, Validators.required],
            user_level: [this.users.user_level],
            name_relation_level: [this.users.name_relation_level],
            email: [this.users.email, Validators.required],
            loginType: [this.users.loginType, Validators.required],
            transDate: [this.users.transDate, Validators.required],
        });
    }

    onEmergencyStatusChange(event: any) {
        const selectedStatus = event.value;
        // user service expects loginType as number or string? 
        // In edit-user.component.ts it sets it to 'فعال'/'غير فعال' string in onEmergencyStatusChange ??
        // But initialize with this.users.loginType which is likely a number (1 or 2).
        // Let's check EditUserComponent logic carefully.
        // EditUserComponent: 
        // if (selectedStatus === 'فعال') this.editNewUserForm.controls.loginType.setValue('فعال');
        // Wait, EditUserComponent.ts (Step 910) lines 166-168: setValue('فعال').
        // But lines 41-42: logIn_Statuss = [{'value': 1...}, {'value': 2...}]
        // And form init: loginType: [this.users.loginType] (number).
        // The radio button uses [value]="status.value" (1 or 2).
        // If user changes radio, event.value is 1 or 2.
        // But onEmergencyStatusChange checks `if (selectedStatus === 'فعال')`. 'فعال' !== 1.
        // So EditUserComponent logic for onEmergencyStatusChange seems broken or I misread it.
        // Ah, logic: `const selectedStatus = event.value;`. event.value is 1 or 2.
        // IF selectedStatus === 'فعال'?? No, it compares 1 to 'فعال'.
        // I should simply update the form control with the value.
        // Wait, the radio group binds to formControlName="loginType". So updates are automatic.
        // I don't need onEmergencyStatusChange unless I need side effects.
        // EditUserComponent has it, maybe legacy.
        // I will remove it and trust form binding, or fix it.
        // I'll stick to form binding.
    }

    EditUser() {
        this.user.editUser(this.editNewUserForm.value).subscribe(() => {
        }, error => {
            if (error.status == 200) {
                this.toster.success("تم تعديل بيانات الفني");
                setTimeout(() => {
                    this.spinner.hide();
                    this.dialogRef.close();
                }, 1000);
            } else {
                this.toster.error("لم يتم التعديل");
                this.spinner.hide();
            }
        });
    }

    onSubmit() {
        this.spinner.show();
        this.EditUser();
    }
}
