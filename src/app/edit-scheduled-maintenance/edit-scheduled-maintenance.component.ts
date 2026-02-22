import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduledService } from 'app/services/scheduled.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-edit-scheduled-maintenance',
  templateUrl: './edit-scheduled-maintenance.component.html',
  styleUrls: ['./edit-scheduled-maintenance.component.scss']
})
export class EditScheduledMaintenanceComponent implements OnInit {

 
  NameFilteredOptions: Observable<any[]>;
  MStatus: string[] = ['تم تحويل الطلب' , 'لم يتم تحويل الطلب'];

  @ViewChild('customerInput') customerInput!: ElementRef<HTMLInputElement>;
  CustomerList: any[] = [];
  CustomerFilteredOptions: Observable<any[]>;
 

  selected:string;
  editScheduledForm!: FormGroup;
  constructor(private fb:FormBuilder,private scheduled:ScheduledService,
    private toster:ToastrService,private spinner:NgxSpinnerService, 
    public dialogRef: MatDialogRef<EditScheduledMaintenanceComponent>,
    @Inject(MAT_DIALOG_DATA) public schedul: any
  ) 
  { 
  
   
  }



  ngOnInit(): void {
console.log(this.schedul.maintenanceDate);
const maintenanceDateold= this.schedul.maintenanceDate;

    this.editScheduledForm = this.fb.group({

      id: [this.schedul.id, Validators.required],
      maintenanceDate:[this.schedul.maintenanceDate, Validators.required],
      status:[this.schedul.status, Validators.required],
      CustomersNum:[this.schedul.customerName, Validators.required],
      intro_id:[this.schedul.intro_id, Validators.required],


    });
    console.log(this.editScheduledForm);


    //Exhibition Code For Filtering And Retrieving the data.
    this.scheduled.GetCustomersName().subscribe((response: any) => {
      this.CustomerList = response;
  
      this.CustomerFilteredOptions = this.editScheduledForm.get('CustomersNum').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._customerFilter(value))
      );
  
      const customerControl = this.editScheduledForm.get('customersNum');

      customerControl.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.CustomerList.find(option => option.customerName === value);
        if (!matchingOption && value !== '') {
          customerControl.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
  
      this.customerInput.nativeElement.addEventListener('focusout', () => {
        const value = customerControl.value;
        const matchingOption = this.CustomerList.find(option => option.customerName === value);
        if (!matchingOption && value.trim() !== '') {
          customerControl.setValue(''); // Clear the input field
          if (!this.CustomerList.some(option => option.customerName.includes(value))){
            this.toster.warning('القيمة التي تم إدخالها لـ "اسم العميل" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
          }
        }
      });
    });
  }









  onStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus ==='تم تحويل الطلب' ) {
      this.editScheduledForm.controls.status.setValue('تم تحويل الطلب' );
    } else if (selectedStatus ===  'لم يتم تحويل الطلب') {
      this.editScheduledForm.controls.status.setValue('لم يتم تحويل الطلب');
    }
  } 
  

  private _customerFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.CustomerList.filter(option => option.customerName.toLowerCase().includes(filterValue));
  }



editScheduled() {
 this.editScheduledForm.get('CustomersNum').setValue(this.schedul.customersNum);
 this.scheduled.updateScheduledMaintenance(this.editScheduledForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toster.success("تم تعديل طلب صيانة الدوريه بنجاح")
      this.spinner.hide();
    }
    else
    {
      this.toster.error("لم يتم تعديل طلب الصيانة الدورية  ")
      this.spinner.hide();

    }
    
  });

}
  


onSubmit(){

  this.spinner.show();
    this.editScheduled();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

} 
    
}

