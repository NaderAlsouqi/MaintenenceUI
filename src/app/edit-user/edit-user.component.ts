import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  hide=true;
  technicalStatus: string[] = [" فعال", " غير فعال"];
  
  myControl = new FormControl(''); 
 
  options: string[] = ['مسؤول المتابعة', 'مدير النظام','الاستقبال', 'المحاسب','سائق', 'امين مستودع','فني', 'قائد فريق','مدير صيانة'];
  options1: string[] =[];
  
  
  editNewUserForm!: FormGroup;
  currentDate: any;
  @ViewChild('name_relation_levelInput') name_relation_levelInput!: ElementRef<HTMLInputElement>;
  @ViewChild('name_User_levelInput') name_User_levelInput!: ElementRef<HTMLInputElement>;
  List1: any[] = [];
  List2: any[] = [];

  filteredOptions: Observable<string[]>;
  filteredOptions1: Observable<string[]>;
  constructor(private fb: FormBuilder,
    private user:UserService,
    private route: ActivatedRoute,
    private toster:ToastrService,private spinner:NgxSpinnerService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public users: any) { }

    logIn_Statuss:any[] = [{'value': 1 , 'name': 'فعال' },
    {'value': 2 , 'name': 'غير فعال'},];
   
    ngOnInit(): void {
      this.getAlluser();

    //Exhibition Code For Filtering And Retrieving the data.
    this.user.GetUser_level().subscribe((response: any) => {
      this.List1 = response;
  
      this.filteredOptions = this.editNewUserForm.get('name_User_level').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._Filter(value))
      );
  
      const Control = this.editNewUserForm.get('name_User_level');
  
      Control.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.List1.find(option => option.name_User_level === value);
        if (!matchingOption && value !== '') {
          Control.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
  
      this.name_User_levelInput.nativeElement.addEventListener('focusout', () => {
        const value = Control.value;
        const matchingOption = this.List1.find(option => option.name_User_level === value);
        if (!matchingOption && value.trim() !== '') {
          Control.setValue(''); // Clear the input field
          if (!this.List1.some(option => option.name_User_level.includes(value))){
          }
        }
      });
    });

    
    // //Exhibition Code For Filtering And Retrieving the data.
    // this.user.getAllUser().subscribe((response: any) => {
    //   this.List2 = response;
  
    //   this.filteredOptions1 = this.editNewUserForm.get('name_relation_level').valueChanges.pipe(
    //     startWith(''),
    //     debounceTime(300), // Adjust debounce time as needed
    //     map(value => this._Filter1(value))
    //   );
  
    //   const Control2 = this.editNewUserForm.get('name_relation_level');
  
    //   Control2.valueChanges.pipe(
    //     debounceTime(300), // Adjust debounce time as needed
    //   ).subscribe(value => {
    //     const matchingOption = this.List2.find(option => option.name_relation_level === value);
    //     if (!matchingOption && value !== '') {
    //     Control2.markAsTouched(); // Mark the control as touched to show any validation errors
    //     }
    //   });
  
    //   this.name_relation_levelInput.nativeElement.addEventListener('focusout', () => {
    //     const value = Control2.value;
    //     const matchingOption = this.List2.find(option => option.name_relation_level === value);
    //     if (!matchingOption && value.trim() !== '') {
    //     Control2.setValue(''); // Clear the input field
    //       if (!this.List2.some(option => option.name_relation_level.includes(value))){
    //       }
    //     }
    //   });
    // });
      this.editNewUserForm = this.fb.group({

        userID: [this.users.userID, Validators.required],
        userNmAr: [this.users.userNmAr, Validators.required],
        password: [this.users.password, Validators.required],
        name_User_level: [this.users.name_User_level, Validators.required],
        user_level: [this.users.user_level], // حقل user_level بدون validation - يتم تحديده من المسمى الوظيفي
        name_relation_level: [this.users.name_relation_level, Validators.required],
        email: [this.users.email, Validators.required],
        loginType: [this.users.loginType, Validators.required],
        transDate: [this.users.transDate, Validators.required],




      });
      
      
     
    }
  
    getAlluser() {
      this.user.getAllUser().subscribe((data) => {
        this.options1 = data;        
      });
    }
      
  // The Exhibition Filtering Method
  private _Filter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.List1.filter(option => option.name_User_level.toLowerCase().includes(filterValue));
  }
    // // The Exhibition Filtering Method
    // private _Filter1(value: string): any[] {
    //   const filterValue = value ? value.toLowerCase() : '';
    //   return this.List2.filter(option => option.name_relation_level.toLowerCase().includes(filterValue));
    // }
  //Setting the name and id of the Exhibition to the FormControl
  selectuser(option: any) {
    const selectedUser = option; // Assign the selected option name to the variable
    this.editNewUserForm.get('name_User_level').setValue(selectedUser.name_User_level);
    // تعيين user_level (role_id) أيضاً
    this.editNewUserForm.get('user_level').setValue(selectedUser.user_level);
  }

//   //Setting the name and id of the Exhibition to the FormControl
//  selectlevel(option: any) {
//     const selectlevel = option; // Assign the selected option name to the variable
//     this.editNewUserForm.get('name_relation_level').setValue(selectlevel.name_relation_level);
//   }

  
    onEmergencyStatusChange(event: any) {
      const selectedStatus = event.value;
      if (selectedStatus === 'فعال') {
        this.editNewUserForm.controls.loginType.setValue('فعال');
      } else if (selectedStatus === 'غير فعال') {
        this.editNewUserForm.controls.loginType.setValue('غير فعال');
      }
    } 
  

    onClose() {
    
      this.dialogRef.close();
    }

 
  EditUser() {  
    this.user.editUser(this.editNewUserForm.value).subscribe(() => {
    }, error => {
      if(error.status==200)
      {
        this.toster.success("تم تعديل بيانات المستخدم")
        setTimeout(() => {
          this.user.getAllUser();
          this.spinner.hide();
        }, 3000);
        
      }
      else
      {
        this.toster.error("لم يتم تعديل بيانات المستخدم")
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
  
   