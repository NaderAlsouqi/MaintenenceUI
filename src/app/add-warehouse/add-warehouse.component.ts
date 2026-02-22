import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AreaService } from 'app/services/area.service';
import { MaintenanceManagerService } from 'app/services/maintenance-manager.service';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { WarehousesService } from 'app/services/warehouses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.scss']
})
export class AddWarehouseComponent implements OnInit {
 
  cityList: string[] = [
    "عمان","الزرقاء","اربد","عجلون","جرش ","معان",
    "الكرك","العقبة","الطفيلة","البلقاء","مادبا ","المفرق"
  ]
  UserList: any[] = [];
  UserFilteredOptions: Observable<any[]>;

  selected:string;
  AddWarehouseForm!: FormGroup;
  constructor(private fb:FormBuilder,
    private Warehouse:WarehousesService,
    private toster:ToastrService,
    private spinner:NgxSpinnerService ,
    public Users: MaintenanceManagerService,
    public dialogRef: MatDialogRef<AddWarehouseComponent>) { }


    @ViewChild('UserIdInput') UserIdInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
  //User Code For Filtering And Retrieving the data.
  this.Users.getTechnicals().subscribe((response: any) => {
    this.UserList = response;

    this.UserFilteredOptions = this.AddWarehouseForm.get('UserNmAr').valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust debounce time as needed
      map(value => this._userFilter(value))
    );

    const userControl = this.AddWarehouseForm.get('UserNmAr');

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

    this.AddWarehouseForm = this.fb.group({
      WarehouseNameArabic: ['', Validators.required],
      WarehouseNameEnglish: ['', Validators.required],
      WarehouseLocation: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      UserID: [null],
      UserNmAr: ['', Validators.required],
     
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
    this.AddWarehouseForm.get('UserID').setValue(selectedUser.userID);
    //this.AddWarehouseForm.get('UserNmAr').setValue(selectedUser.userNmAr);
  }
  AddWarehouse() {
    this.Warehouse.AddWarehouse(this.AddWarehouseForm.value).subscribe(() => { }, error => {
      if(error.status==200)
      {
        this.toster.success("تم اضافة مستودع جديد")
        setTimeout(() => {
          this.Warehouse.getAllwarehouse();
          this.spinner.hide();
        }, 3000);
        
      }
      else
      {
        this.toster.error("لم يتم الاضافه")
        this.spinner.hide();

      }
      
    });

  }

  onClose() {
    
    this.dialogRef.close();
  }
onSubmit(){
  this.spinner.show();
    this.AddWarehouse();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

} 
    
}
