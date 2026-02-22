import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';


@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {
  hide = true;
  loginType = '1';
  Status = { value: 1, name: 'فعال' };
  User_Statuss: any[] = [{ 'value': 1, 'name': 'فعال' },
  { 'value': 2, 'name': 'غير فعال' },];
  myControl = new FormControl('');

  @ViewChild('name_User_levelInput') name_User_levelInput!: ElementRef<HTMLInputElement>;
  List1: any[] = [];
  List2: any[] = [];

  filteredOptions: Observable<string[]>;
  filteredOptions1: Observable<string[]>;
  addNewUserForm!: FormGroup;
  currentDate: any;

  constructor(private fb: FormBuilder, private user: UserService,
    private route: ActivatedRoute,
    private toster: ToastrService, private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddNewUserComponent>) { }



  ngOnInit(): void {
    this.currentDate = new Date();

    //Exhibition Code For Filtering And Retrieving the data.
    this.user.GetUser_level().subscribe((response: any) => {
      this.List1 = response;

      this.filteredOptions = this.addNewUserForm.get('name_User_level').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._Filter(value))
      );

      const Control = this.addNewUserForm.get('name_User_level');

      Control.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.List1.find(option => option.name_User_level === value);
        if (!matchingOption && value !== '') {
          Control.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });

      if (this.name_User_levelInput && this.name_User_levelInput.nativeElement) {
        this.name_User_levelInput.nativeElement.addEventListener('focusout', () => {
          const value = Control.value;
          const matchingOption = this.List1.find(option => option.name_User_level === value);
          if (!matchingOption && value.trim() !== '') {
            Control.setValue(''); // Clear the input field
            if (!this.List1.some(option => option.name_User_level.includes(value))) {
            }
          }
        });
      }
    });

    this.addNewUserForm = this.fb.group({
      userNmAr: ['', Validators.required],
      password: ['', Validators.required],
      name_User_level: ['', Validators.required],
      user_level: [''], // حقل user_level بدون validation - يتم تحديده تلقائياً من المسمى الوظيفي
      name_relation_level: ['',],
      email: ['', [Validators.required, Validators.email]],
      loginType: ['', Validators.required],
      transDate: ['',],




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
    this.addNewUserForm.get('name_User_level').setValue(selectedUser.name_User_level);
    // تعيين user_level (role_id) أيضاً
    this.addNewUserForm.get('user_level').setValue(selectedUser.user_level);
  }

  //   //Setting the name and id of the Exhibition to the FormControl
  //  selectlevel(option: any) {
  //     const selectlevel = option; // Assign the selected option name to the variable
  //     this.addNewUserForm.get('name_relation_level').setValue(selectlevel.name_relation_level);
  //   }


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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    this.addNewUserForm.get('transDate').setValue(formattedDate);

    // Default name_relation_level if empty
    if (!this.addNewUserForm.get('name_relation_level').value) {
      this.addNewUserForm.patchValue({ name_relation_level: 'Admin' });
    }

    this.user.addUser(this.addNewUserForm.value).subscribe(() => {
      this.toster.success("تم اضافة مستخدم جديد");
      setTimeout(() => {
        this.spinner.hide();
        this.dialogRef.close();
      }, 1000);
    }, error => {
      if (error.status == 200) {
        this.toster.success("تم اضافة مستخدم جديد");
        setTimeout(() => {
          this.spinner.hide();
          this.dialogRef.close();
        }, 1000);
      } else {
        this.toster.error("لم يتم اضاقه مستخدم");
        this.spinner.hide();
      }
    });

  }

  onClose() {

    this.dialogRef.close();
  }
  onSubmit() {
    this.spinner.show();
    this.AddUser();
    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

  }








}