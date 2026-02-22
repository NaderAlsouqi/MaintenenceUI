import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceManagerService } from 'app/services/maintenance-manager.service';
import { WarehousesService } from 'app/services/warehouses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-edit-warehouse',
  templateUrl: './edit-warehouse.component.html',
  styleUrls: ['./edit-warehouse.component.scss']
})
export class EditWarehouseComponent implements OnInit {
  editWarehouseForm!: FormGroup;
  cityList: string[] = [
    "عمان","الزرقاء","اربد","عجلون","جرش ","معان",
    "الكرك","العقبة","الطفيلة","البلقاء","مادبا ","المفرق"
  ]
  constructor(
    private fb: FormBuilder,    
    private _warehouse:WarehousesService,
    private toster:ToastrService,
    private spinner:NgxSpinnerService, 
    private route: ActivatedRoute,
    private router: Router,
    public Users: MaintenanceManagerService,
    public dialogRef: MatDialogRef<EditWarehouseComponent>,
 @Inject(MAT_DIALOG_DATA) public Warehouse: any) { }
 @ViewChild('UserIdInput') UserIdInput!: ElementRef<HTMLInputElement>;
 UserList: any[] = [];
  UserFilteredOptions: Observable<any[]>;
  ngOnInit(): void {
//User Code For Filtering And Retrieving the data.
this.Users.getTechnicals().subscribe((response: any) => {
  this.UserList = response;

  this.UserFilteredOptions = this.editWarehouseForm.get('UserNmAr').valueChanges.pipe(
    startWith(''),
    debounceTime(300), // Adjust debounce time as needed
    map(value => this._userFilter(value))
  );

  const userControl = this.editWarehouseForm.get('UserNmAr');

  userControl.valueChanges.pipe(
    debounceTime(300), // Adjust debounce time as needed
  ).subscribe(value => {
    const matchingOption = this.UserList.find(option => option.userNmAr === value);
    if (!matchingOption && value !== '') {
      userControl.markAsTouched(); // Mark the control as touched to show any validation errors
    }
  });

  this.UserIdInput.nativeElement.addEventListener('focusout', () => {
    const value = userControl.value;
    const matchingOption = this.UserList.find(option => option.userNmAr === value);
    if (!matchingOption && value.trim() !== '') {
      userControl.setValue(''); // Clear the input field
      if (!this.UserList.some(option => option.userNmAr.includes(value))){
        this.toster.warning('القيمة التي تم إدخالها لـ "اسم الفني" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
      }
    }
  });
});

  this.editWarehouseForm = this.fb.group({
   WarehouseNumber: [this.Warehouse.warehouseNumber, Validators.required],
   WarehouseNameArabic: [this.Warehouse.warehouseNameArabic, Validators.required],
   WarehouseNameEnglish: [this.Warehouse.warehouseNameEnglish, Validators.required],
   WarehouseLocation: [this.Warehouse.warehouseLocation, Validators.required],
   PhoneNumber: [this.Warehouse.phoneNumber, Validators.required],
   UserID: [this.Warehouse.userID, Validators.required],
   UserNmAr: [this.Warehouse.userNmAr , Validators.required],

});

}



  // The User Filtering Method
  private _userFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.UserList.filter(option => option.userNmAr.toLowerCase().includes(filterValue));
  }
   //Setting the name and id of the user to the FormControl
   selectUser(option: any) {
    const selectedUser = option; // Assign the selected option name to the variable
    this.editWarehouseForm.get('UserID').setValue(selectedUser.userID);
    this.editWarehouseForm.get('UserNmAr').setValue(selectedUser.userNmAr);
  }
EditWarehouse() {
 console.log(this.editWarehouseForm) 
  this._warehouse.UpdateWarehouse(this.editWarehouseForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toster.success("تم تعديل بيانات المستودع")
      setTimeout(() => {
        this._warehouse.getAllwarehouse();
        this.spinner.hide();
      }, 3000);
      
    }
    else
    {
      this.toster.error(" لم يتم تعديل بيانات المستودع ")
      this.spinner.hide();

    }
    
  });

}


onClose() {
    
  this.dialogRef.close();
}
onSubmit() {
  this.spinner.show();
  this.EditWarehouse();

  setTimeout(() => {

    this.spinner.hide();
  }, 5000);

}


  
 
  }

 