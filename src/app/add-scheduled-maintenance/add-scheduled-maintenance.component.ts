import { DatePipe, NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduledService } from 'app/services/scheduled.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-scheduled-maintenance',
  templateUrl: './add-scheduled-maintenance.component.html',
  styleUrls: ['./add-scheduled-maintenance.component.scss']
})
export class AddScheduledMaintenanceComponent implements OnInit {

  NameFilteredOptions: Observable<any[]>;
  MStatus: string[] = ['لم يتم تحويل الطلب' , 'تم تحويل الطلب'];
  @ViewChild('customerInput') customerInput!: ElementRef<HTMLInputElement>;
  CustomerList: any[] = [];
  CustomerFilteredOptions: Observable<any[]>;
   isIntroIdExists = false;
   public dialogRef: boolean = false;

  selected:string;
  addScheduledForm!: FormGroup;
  constructor(private fb:FormBuilder,private scheduled:ScheduledService,
    private toster:ToastrService,private spinner:NgxSpinnerService
  ) 
  { 
  
   
  }



  ngOnInit(): void {
   
    this.addScheduledForm = this.fb.group({
      maintenanceDate: ['',Validators.required],
      status: ['لم يتم تحويل الطلب', Validators.required],
      CustomersNum: ['', Validators.required],
      intro_id: ['', Validators.required],

     
    });
  
   
  
  
    
    //Exhibition Code For Filtering And Retrieving the data.
    this.scheduled.GetCustomersName().subscribe((response: any) => {
      this.CustomerList = response;
  
      this.CustomerFilteredOptions = this.addScheduledForm.get('CustomersNum').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._customerFilter(value))
      );
  
      const customerControl = this.addScheduledForm.get('customersNum');

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
    if (selectedStatus === 'تم تحويل الطلب' ) {
      this.addScheduledForm.controls.status.setValue('تم تحويل الطلب' );
    } else if (selectedStatus === 'لم يتم تحويل الطلب') {
      this.addScheduledForm.controls.status.setValue( 'لم يتم تحويل الطلب');
    }
  } 
  
  

  private _customerFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.CustomerList.filter(option => option.customerName.toLowerCase().includes(filterValue));
  }



selectCustomer(option: any) {
  const selectedCustomer = option;
 this.addScheduledForm.get('CustomersNum').setValue(selectedCustomer.customerName);
}




AddScheduled() {

  this.scheduled.addNewScheduledMaintenance(this.addScheduledForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toster.success("تم اضافة طلب صيانة دورية بنجاح")
      this.spinner.hide();
    }
    else
    {
      this.toster.error("لم يتم اضافة ")
      this.spinner.hide();

    }
    
  });

}
  


onSubmit(){
  const introId1 = this.addScheduledForm.get('intro_id').value;
  console.log(introId1); 
  this.scheduled.GetAllMaintIntroState(introId1).subscribe(
    (result) => {

      if (result.length !== 0 ) {
        // قائمة (مصفوفة) غير فارغة
        this.addScheduledForm.get('intro_id').setValue(introId1);
         this.AddScheduled();
      }else{
     // this.addScheduledForm.get('intro_id').setValue('');
      this.toster.warning('القيمة التي تم إدخالها لـ "رقم طلب الصيانة" لا تتطابق او غير صحيحة.', 'تحذير', { timeOut: 5000 });
 } } 
     )
  this.spinner.show();


    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

} 
    
}

