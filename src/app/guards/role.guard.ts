import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token')?.toString();

    if (!token) {
      this.router.navigate(['auth/login']);
      this.toastr.warning('يرجى تسجيل الدخول أولاً');
      return false;
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userRole = Number(decodedToken.role_id);
      const allowedRoles = route.data['roles'] as Array<number>;

      // إذا لم يتم تحديد أدوار معينة، السماح بالوصول
      if (!allowedRoles || allowedRoles.length === 0) {
        return true;
      }

      // التحقق من أن دور المستخدم ضمن الأدوار المسموحة
      if (allowedRoles.includes(userRole)) {
        return true;
      }

      // إذا كان المستخدم محاسب (role_id = 6) ويحاول الوصول لصفحة غير سندات القبض
      if (userRole === 6) {
        this.toastr.warning('ليس لديك صلاحية الوصول لهذه الصفحة. يمكنك الوصول فقط لصفحة سندات القبض');
        this.router.navigate(['/bills']);
        return false;
      }

      // المستخدم ليس لديه صلاحية
      this.toastr.warning('ليس لديك صلاحية الوصول لهذه الصفحة');
      this.router.navigate(['/dashboard']);
      return false;

    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['auth/login']);
      this.toastr.error('حدث خطأ في التحقق من الصلاحيات');
      return false;
    }
  }
}
