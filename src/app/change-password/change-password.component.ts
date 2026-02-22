import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private route: Router,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.validateOldPassword();
    }
  }

  validateOldPassword() {
    const userId = this.auth.id;
    const oldPassword = this.passwordForm.get('oldPassword').value;

    this.userService.validateOldPassword(userId, oldPassword).subscribe(
      (response: any) => {
        // Nothing
      },
      (error) => {
        if (error.status === 200) {
          // Old password is correct, proceed to update the password
          this.updatePassword();
        } else if (error.status === 400) {
          // Old password is incorrect
          this.toastr.error('كلمة المرور القديمة غير صحيحة', 'خطأ');
        } else {
          this.toastr.error('حدث خطأ أثناء التحقق من كلمة المرور القديمة', 'خطأ');
        }
      }
    );
  }

  updatePassword() {
    const userId = this.auth.id;
    const newPassword = this.passwordForm.get('newPassword').value;

    this.userService.updatePassword(userId, newPassword).subscribe(
      (response: any) => {
        // Nothing
      },
      (error) => {
        if (error.status === 200) {
          this.toastr.success('تم تحديث كلمة المرور بنجاح', 'نجاح');
          this.dialogRef.close();
        } else {
          this.toastr.error('خطأ أثناء تحديث كلمة المرور', 'خطأ');
        }
      }
    );
  }
}
