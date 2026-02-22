import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AreaService } from 'app/services/area.service';
import { ItemService } from 'app/services/item.service';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { WarehousesService } from 'app/services/warehouses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-new-item',
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.scss']
})
export class AddNewItemComponent implements OnInit {
  cityList: string[] = [
    "عمان","الزرقاء","اربد","عجلون","جرش ","معان",
    "الكرك","العقبة","الطفيلة","البلقاء","مادبا ","المفرق"
  ]
  ExhibitionFilteredOptions: Observable<any[]>;

  ExhibitionList: any[] = [];

  selected:string;
  addItemForm!: FormGroup;
  constructor(
    private fb:FormBuilder,
    private item:ItemService,
    private toster:ToastrService,
    private spinner:NgxSpinnerService,
    private warehouses:WarehousesService,
    public dialogRef: MatDialogRef<AddNewItemComponent>) { }
  @ViewChild('exhibitionInput') exhibitionInput!: ElementRef<HTMLInputElement>;


  ngOnInit(): void {
  
     //Exhibition Code For Filtering And Retrieving the data.
     this.warehouses.GetWarehouseNames().subscribe((response: any) => {
      this.ExhibitionList = response;
  
      this.ExhibitionFilteredOptions = this.addItemForm.get('warehouseNameArabic').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._exhibitionFilter(value))
      );
  
      const exhibitionControl = this.addItemForm.get('warehouseNameArabic');
  
      exhibitionControl.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.ExhibitionList.find(option => option.warehouseNameArabic === value);
        if (!matchingOption && value !== '') {
          exhibitionControl.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
  
      this.exhibitionInput.nativeElement.addEventListener('focusout', () => {
        const value = exhibitionControl.value;
        const matchingOption = this.ExhibitionList.find(option => option.warehouseNameArabic === value);
        if (!matchingOption && value.trim() !== '') {
          exhibitionControl.setValue(''); // Clear the input field
          if (!this.ExhibitionList.some(option => option.warehouseNameArabic.includes(value))){
            this.toster.warning('القيمة التي تم إدخالها لـ "اسم المعرض" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
          }
        }
      });
    });


    this.addItemForm = this.fb.group({
      ItemName: ['', Validators.required],
      ItemPieces: ['', Validators.required],
      ItemPiece: ['', Validators.required],
      warehouseNumber: ['', Validators.required],
      warehouseNameArabic: ['', Validators.required],  
    });
   
 
  }
  
  // The Exhibition Filtering Method
  private _exhibitionFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.ExhibitionList.filter(option => option.warehouseNameArabic.toLowerCase().includes(filterValue));
  }
  selectExhibition(option: any) {
    const selectedExhibition = option; // Assign the selected option name to the variable
    this.addItemForm.get('warehouseNumber').setValue(selectedExhibition.warehouseNumber);
    this.addItemForm.get('warehouseNameArabic').setValue(selectedExhibition.warehouseNameArabic);
  }

  AddNewItem() {
    this.item.AddNewItem(this.addItemForm.value).subscribe(() => { }, error => {
      if(error.status==200)
      {
        this.toster.success("تم اضافة المادة")
        setTimeout(() => {
          this.item.getAllitem();
          this.spinner.hide();
        }, 3000);
        
      }
      else
      {
        this.toster.error("لم يتم اضافة المادة")
        this.spinner.hide();

      }
      
    });

  }

  onClose() {
    
    this.dialogRef.close();
  }
onSubmit(){
  this.spinner.show();
    this.AddNewItem();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

} 
    
}
