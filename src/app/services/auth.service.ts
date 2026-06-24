import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   
  mangerToken: any;

  constructor(private http :HttpClient, private spinner :NgxSpinnerService, private toster :ToastrService) { }
  user:any='';
  loggedin:boolean=false;
  id:any;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  role:any;
  url=environment.baseUrl;

  //Login method -------------------------------
  login(model:any)
  {
    return this.http.post(this.url+"TblUsers/Login",model).pipe(
      map((value:any) =>
      {
        const user=value;
        if(user !=null)
        {
        localStorage.setItem("token",user.token);
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
        this.id=this.decodedToken.nameid;
        this.role=this.decodedToken?.role_id;
        this.loggedin=true;
      }
      })
    );
  }

  // Demo login -------------------------------
  // Auto sign-in for the public iframe preview (?demo=1). Calls a DEDICATED backend endpoint
  // that issues a short-lived, read-only demo JWT for the demo account. No credentials are
  // sent from the client, so NO password ships in the JS bundle. The resulting token is
  // stored under the same 'token' key the rest of the app already reads.
  demoLogin() {
    return this.http.post(this.url + environment.demoLoginEndpoint, {}).pipe(
      map((value: any) => {
        if (value != null && value.token) {
          localStorage.setItem("token", value.token);
          this.decodedToken = this.jwtHelper.decodeToken(value.token);
          this.id = this.decodedToken?.nameid;
          this.role = this.decodedToken?.role_id;
          this.loggedin = true;
        }
        return value;
      })
    );
  }

  // LoggedIn -------------------------------
  loggedIn()
  {
    const token=localStorage.getItem("token");
    return ! this.jwtHelper.isTokenExpired(token?.toString());
  }

  // Get the user position -------------------------------
  authrole(){
    const token=localStorage.getItem("token")?.toString();
    this.decodedToken = this.jwtHelper.decodeToken(token);
    this.role=this.decodedToken?.role_id;
    return this.role;
  }

  //Change the password -------------------------------
  changePassword(model:any){
    this.spinner.show();
    return this.http.put(this.url+"Auth/ChangePassword",model).subscribe((res)=>
    {
      if(res=='passowrd has Changed')
        this.toster.success('تم تغير كلمة ابمرور');
    
    },err=>{
      this.toster.error("لم يقم بتغير كلمة المرور");
    })
  }

  // checking if the user is logged in or not 
  IsloggedIn(){
    const token =localStorage.getItem('token');
    return !!token;
  }

  getUserId(): number | null {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userId = decodedToken.nameid;
      return userId ? +userId : null; // تحويله إلى رقم والتحقق من وجوده
    }
    return null; // إذا لم يتم العثور على التوكن
  }

}
