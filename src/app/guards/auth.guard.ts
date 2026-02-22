import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(protected authService:AuthService,private router:Router,private toster:ToastrService)
  {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
      const token = localStorage.getItem('token')?.toString();
   
      if(this.authService.loggedIn())
      {
     
        /*if(state.url.indexOf('admin') >=0){

          
            // this.toster.error('You should be logged !');
            // this.router.navigate(['auth/login']);
          if(this.authService.authrole()=='Admin' || this.authService.authrole()=='MainAdmin'){
            this.toster.success('welcome');
            return true;
        
          }
          else
          {
            this.router.navigate(['accessforbidden/403']);
            this.toster.warning('this page for admin');
            return false;
          }
        }*/
        this.toster.success('welcome');
        return true;
      }
        else {
          this.router.navigate(['auth/login']);
          this.toster.warning('Please login !!')
          return false;
        }
    }
  
  
}
