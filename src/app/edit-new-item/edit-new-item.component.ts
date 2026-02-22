import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from 'app/services/area.service';
import { ItemService } from 'app/services/item.service';
import { WarehousesService } from 'app/services/warehouses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-edit-new-item',
  templateUrl: './edit-new-item.component.html',
  styleUrls: ['./edit-new-item.component.scss']
})
export class EditNewItemComponent implements OnInit {
  ExhibitionFilteredOptions: Observable<any[]>;

  ExhibitionList: any[] = [];

  edititemForm!: FormGroup;
  cityList: string[] = [
    "عمان","الزرقاء","اربد","عجلون","جرش ","معان",
    "الكرك","العقبة","الطفيلة","البلقاء","مادبا ","المفرق"
  ]
  constructor(
    private fb: FormBuilder,    
    private _item:ItemService,
    private toster:ToastrService,
    private spinner:NgxSpinnerService, 
    private route: ActivatedRoute,
    private router: Router,
    private warehouses:WarehousesService,

    public dialogRef: MatDialogRef<EditNewItemComponent>,
 @Inject(MAT_DIALOG_DATA) public item: any) { }
 @ViewChild('exhibitionInput') exhibitionInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
//Exhibition Code For Filtering And Retrieving the data.
this.warehouses.GetWarehouseNames().subscribe((response: any) => {
  this.ExhibitionList = response;

  this.ExhibitionFilteredOptions = this.edititemForm.get('warehouseNameArabic').valueChanges.pipe(
    startWith(''),
    debounceTime(300), // Adjust debounce time as needed
    map(value => this._exhibitionFilter(value))
  );

  const exhibitionControl = this.edititemForm.get('warehouseNameArabic');

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

  this.edititemForm = this.fb.group({
    ItemNumber: [this.item.itemNumber, Validators.required],
    ItemName: [this.item.itemName, Validators.required],
    ItemPieces: [this.item.itemPieces, Validators.required],
    ItemPiece: [this.item.itemPiece, Validators.required],
    warehouseNumber: [this.item.warehouseNumber, Validators.required],
    warehouseNameArabic: [this.item.warehouseNameArabic, Validators.required],

     


});

}

 // The Exhibition Filtering Method
 private _exhibitionFilter(value: string): any[] {
  const filterValue = value ? value.toLowerCase() : '';
  return this.ExhibitionList.filter(option => option.warehouseNameArabic.toLowerCase().includes(filterValue));
}
selectExhibition(option: any) {
  const selectedExhibition = option; // Assign the selected option name to the variable
  this.edititemForm.get('warehouseNumber').setValue(selectedExhibition.warehouseNumber);
  this.edititemForm.get('warehouseNameArabic').setValue(selectedExhibition.warehouseNameArabic);
}


EditItem() {
  this._item.UpdateItem(this.edititemForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toster.success("نم تعديل بيانات المادة")
      setTimeout(() => {
        this._item.getAllitem();
        this.spinner.hide();
      }, 3000);
      
    }
    else
    {
      this.toster.error("لم يتم تعديل بيانات المادة")
      this.spinner.hide();

    }
    
  });

}
onClose() {
    
  this.dialogRef.close();
}


onSubmit() {
  this.spinner.show();
  this.EditItem();

  setTimeout(() => {

    this.spinner.hide();
  }, 5000);

}


  
 
  }

 