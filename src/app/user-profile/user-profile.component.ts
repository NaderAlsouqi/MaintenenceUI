import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private user: UserService,
    private toster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private titleService: Title
  ) {

  }
  users: any;
  editNewUserForm!: FormGroup;

  ngOnInit() {
    // to change the tab Title name .
    this.titleService.setTitle('الصفحة الشخصية');

    const userId = this.auth.getUserId();

    this.user.getUserByID(userId).subscribe((userData) => {
      this.users = userData; // تخزين بيانات المستخدم في الكائن users
      if (this.users) {

        this.editNewUserForm = this.fb.group({

          userID: [this.users[0].userID, Validators.required],
          userNmAr: [this.users[0].userNmAr, Validators.required],
          password: [this.users[0].password, Validators.required],
          name_User_level: [this.users[0].name_User_level, Validators.required],
          name_relation_level: [this.users[0].name_relation_level, Validators.required],
          email: [this.users[0].email, Validators.required],
          loginType: [this.users[0].loginType, Validators.required],
          transDate: [this.users[0].transDate, Validators.required],
        });
      }
    })


  }

  EditUser() {
    this.user.editUser(this.editNewUserForm.value).subscribe(() => {

    }, error => {
      if (error.status == 200) {
        this.toster.success("تم تعديل الملف الشخصي")
        setTimeout(() => {
          this.user.getAllUser();
          this.spinner.hide();
        }, 3000);

      }
      else {
        this.toster.error("لم يتم تعديل الملف الشخصي")
        this.spinner.hide();

      }

    });

  }

  onSubmit() {
    this.spinner.show();
    this.EditUser();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

  }

}
