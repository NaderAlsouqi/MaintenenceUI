import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
   private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  updateData() {
    this.dataUpdatedSource.next();
  }

  constructor(private http:HttpClient,private router :Router,private toster:ToastrService,private spinner:NgxSpinnerService) { }
  url=environment.baseUrl+'TblUsers/';

  getAllUser(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'GetUsers').pipe(
      tap((res: any) => {
        this.spinner.hide();
        //this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }
  GetUser_level(): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + 'GetUser_level').pipe(
      tap((res: any) => {
        this.spinner.hide();
       // this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  getUserByID(id: number): Observable<any> {
    this.spinner.show();
    return this.http.get(this.url + `getUserByID/${id}`).pipe( // Include the 'id' in the URL
      tap((res: any) => {
        this.spinner.hide();
        //this.toster.success('Data Returned');
      }),
      catchError((err) => {
        this.spinner.hide();
        this.toster.error('لم يقم بارجاع البيانات');
        throw err;
      })
    );
  }

  deleteUser(UserID: number): Observable<any> {
      return this.http.put(this.url + 'softDeleteUsers', UserID).pipe(
        map((res: any) => {
          this.toster.success('تم الحذف :) ');
          this.getAllUser().subscribe(); // Update all user after editing
  
          return res;
        }),
        catchError((err) => {
          if (err.status === 200) {
            this.toster.success('تم الحذف :) ');
            this.getAllUser().subscribe(); // Update all user  after editing
            this.updateData();
  
          } else {
            this.toster.error('لم يتم الحذف');
          }
          throw err;
        })
      );
    }

  addUser(model: any): Observable<any> {

    const formData = new FormData();

    // تحديد user_level بناءً على المسمى الوظيفي
    let userLevel = model.user_level;

    // إذا لم يكن user_level محدداً، حدده بناءً على المسمى الوظيفي (fallback)
    if (!userLevel && model.name_User_level) {
      const roleMappings: { [key: string]: number } = {
        'مدير صيانة': 1,
        'قائد فريق': 2,
        'فني': 3,
        'امين مستودع': 4,
        'سائق': 5,
        'المحاسب': 6,
        'محاسب': 6,
        'مسؤول المتابعة': 7,
        'الاستقبال': 8,
        'مدير النظام': 9
      };
      userLevel = roleMappings[model.name_User_level];
    }

    // إضافة user_level إلى FormData
    if (userLevel) {
      formData.append('User_level', userLevel.toString());
    }

    formData.append('UserNmAr', model.userNmAr);
    formData.append('Password', model.password);
    formData.append('name_User_level', model.name_User_level);
    formData.append('name_relation_level', model.name_relation_level);
    formData.append('Email', model.email);
    formData.append('TransDate', model.transDate);
    formData.append('loginType', model.loginType.value);


    return this.http.post(this.url + 'AddNewUser', formData).pipe(
      map((res: any) => {
        // Process the response if needed
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );

  }

  editUser(model: any): Observable<any> {
    const formData = new FormData();

    // تحديد user_level بناءً على المسمى الوظيفي
    let userLevel = model.user_level;

    // إذا لم يكن user_level محدداً، حدده بناءً على المسمى الوظيفي (fallback)
    if (!userLevel && model.name_User_level) {
      const roleMappings: { [key: string]: number } = {
        'مدير صيانة': 1,
        'قائد فريق': 2,
        'فني': 3,
        'امين مستودع': 4,
        'سائق': 5,
        'المحاسب': 6,
        'محاسب': 6,
        'مسؤول المتابعة': 7,
        'الاستقبال': 8,
        'مدير النظام': 9
      };
      userLevel = roleMappings[model.name_User_level];
    }

    // إضافة user_level إلى FormData
    if (userLevel) {
      formData.append('User_level', userLevel.toString());
    }

    formData.append('UserNmAr', model.userNmAr);
    formData.append('Password', model.password);
    formData.append('name_User_level', model.name_User_level);
    formData.append('name_relation_level', model.name_relation_level);
    formData.append('Email', model.email);
    formData.append('TransDate', model.transDate);
    formData.append('UserID', model.userID);
    formData.append('loginType', model.loginType);

    return this.http.put(this.url + 'EditeUsers', formData).pipe(
      map((res: any) => {
        this.toster.success('تم التعديل :) ');
        this.getAllUser().subscribe(); // Update all user after editing

        return res;
      }),
      catchError((err) => {
        if (err.status === 200) {
          this.toster.success('تم التعديل :) ');
          this.getAllUser().subscribe(); // Update all user  after editing

        } else {
          this.toster.error('لم يتم التعديل');
        }
        throw err;
      })
    );
  }

  validateOldPassword(UserId: number, OldPassword: string): Observable<boolean> {
    return this.http.post<any>(this.url + 'CheckOldPassword', {
      UserId,
      OldPassword,
    });
  }

  updatePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.post<any>(this.url + 'ChangePassword', {
      userId,
      newPassword,
    });
  }

}
