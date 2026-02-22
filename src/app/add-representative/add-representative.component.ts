import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RepresentativeService } from 'app/services/representative.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-representative',
  templateUrl: './add-representative.component.html',
  styleUrls: ['./add-representative.component.scss']
})
export class AddRepresentativeComponent implements OnInit {
  addRepresentativeForm!: FormGroup;
  
  myControl = new FormControl();
  ExhibitionFilteredOptions: Observable<any[]>;
  ExhibitionList: any[] = [];


  
  @ViewChild('exhibitionInput') exhibitionInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,private representative:RepresentativeService,
    private toster:ToastrService,private spinner:NgxSpinnerService,
    public dialogRef: MatDialogRef<AddRepresentativeComponent>) { }


  ngOnInit(): void {this.addRepresentativeForm = this.fb.group({

    deviceType:['', Validators.required],
    deviceSR: ['', Validators.required],
    customers_FName:['', Validators.required],
    customersNum:['', Validators.required],
    deviceID:['', Validators.required],
    
  });
  
    //Exhibition Code For Filtering And Retrieving the data.
    this.representative.getExhibition().subscribe((response: any) => {
      this.ExhibitionList = response;
  
      this.ExhibitionFilteredOptions = this.addRepresentativeForm.get('deviceSR').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._exhibitionFilter(value))
      );
  
      const exhibitionControl = this.addRepresentativeForm.get('deviceSR');
  
      exhibitionControl.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.ExhibitionList.find(option => option.deviceSR === value);
        if (!matchingOption && value !== '') {
          exhibitionControl.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
  
      this.exhibitionInput.nativeElement.addEventListener('focusout', () => {
        const value = exhibitionControl.value;
        const matchingOption = this.ExhibitionList.find(option => option.exhibitionIDNmAr === value);
        if (!matchingOption && value.trim() !== '') {
          exhibitionControl.setValue(''); // Clear the input field
          if (!this.ExhibitionList.some(option => option.exhibitionIDNmAr.includes(value))){
            this.toster.warning('القيمة التي تم إدخالها لـ "اسم المعرض" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
          }
        }
      });
    });
}  

// The Exhibition Filtering Method
private _exhibitionFilter(value: string): any[] {
  const filterValue = value ? value.toLowerCase() : '';
  return this.ExhibitionList.filter(option => option.exhibitionIDNmAr.toLowerCase().includes(filterValue));
}
AddRepresentative() {

  this.representative.addRepresentative(this.addRepresentativeForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toster.success("تم اضافة مندوب ")
      setTimeout(() => {
        this.representative.GetDevice();
        this.spinner.hide();
      }, 3000);
      
    }
    else
    {
      this.toster.error("لم يتم اضافة ")
      this.spinner.hide();

    }
    
  });

}
onClose() {
    
  this.dialogRef.close();
}

onSubmit(){
this.spinner.show();
  this.AddRepresentative();

  setTimeout(() => {

    this.spinner.hide();
  }, 5000);

}
}