import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;

  constructor(private spinner: NgxSpinnerService, private auth: AuthService, private tostar: ToastrService, private route: Router) { }

  data: any = {};
  users: any;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  public selectedField = "";
  onFocus(identifier: string) {
    this.selectedField = identifier;
  }

  onBlur() {
    this.selectedField = "";
  }

  
  ngOnInit(): void {
    if (this.auth.IsloggedIn()) {
      this.route.navigate(['dashboard']);
   }

  }

  onSubmit() {
    this.spinner.show()
    this.login();

    setTimeout(() => {

      this.spinner.hide();
    }, 2000);

  }

  login() {
    debugger;
    this.auth.login(this.loginForm.value).subscribe(next => {
      
      this.tostar.success(`Welcome ${this.auth.decodedToken?.unique_name}`)
      if (this.auth.role == 1)
        this.route.navigate(['dashboard'])
      else
        this.route.navigate([''])

    }, error => {
      this.tostar.error("لم يتم تسجيل الدخول ");



    })


  }

  loggedIn() {
    return this.auth.loggedIn();

  }
  logout() {
    localStorage.removeItem("token");

  }

}