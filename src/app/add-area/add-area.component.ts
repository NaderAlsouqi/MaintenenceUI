import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AreaService } from 'app/services/area.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.scss']
})
export class AddAreaComponent implements OnInit {
  cityList: string[] = [
    "عمان", "الزرقاء", "اربد", "عجلون", "جرش ", "معان",
    "الكرك", "العقبة", "الطفيلة", "البلقاء", "مادبا ", "المفرق"
  ]


  selected: string;
  addAreaForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private area: AreaService, private toster: ToastrService, private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddAreaComponent>) { }



  ngOnInit(): void {
    this.addAreaForm = this.fb.group({
      noCity: ['', Validators.required],
      CityNameAr: ['', Validators.required],
      Governorate: ['', Validators.required],

    });


  }

  AddArea() {
    this.area.addArea(this.addAreaForm.value).subscribe(() => {
      // Success callback
      this.toster.success("تم الاضافة بنجاح");
      this.spinner.hide();
      this.dialogRef.close(true); // Close with success
    }, error => {
      if (error.status == 200) {
        this.toster.success("تم الاضافة بنجاح");
        this.spinner.hide();
        this.dialogRef.close(true); // Close with success
      } else {
        this.toster.error("لم يتم الاضافة");
        this.spinner.hide();
      }
    });
  }


  onClose() {

    this.dialogRef.close();
  }
  onSubmit() {
    this.spinner.show();
    this.AddArea();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

  }

}
