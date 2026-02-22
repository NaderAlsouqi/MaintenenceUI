import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from 'app/services/area.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.scss']
})
export class EditAreaComponent implements OnInit {

  editAreaForm!: FormGroup;
  cityList: string[] = [
    "عمان", "الزرقاء", "اربد", "عجلون", "جرش ", "معان",
    "الكرك", "العقبة", "الطفيلة", "البلقاء", "مادبا ", "المفرق"
  ]
  constructor(
    private fb: FormBuilder,
    private _area: AreaService,
    private toster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<EditAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public area: any) { }

  ngOnInit(): void {

    this.editAreaForm = this.fb.group({
      CityID: [this.area.cityID, Validators.required],
      CityNameAr: [this.area.cityNameAr, Validators.required],
      Governorate: [this.area.governorate, Validators.required],
      NoCity: [this.area.noCity, Validators.required],
    });

  }



  EditArea() {
    this._area.editArea(this.editAreaForm.value).subscribe(
      (response) => {
        // Success callback
        this.toster.success("تم تعديل المنطقة");
        this.spinner.hide();
        // Close modal after 1 second
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      (error) => {
        // Error callback
        if (error.status == 200) {
          this.toster.success("تم تعديل المنطقة");
          this.spinner.hide();
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000);
        } else {
          this.toster.error("لم يتم تعديل المنطقة");
          this.spinner.hide();
        }
      }
    );
  }

  onClose() {

    this.dialogRef.close();
  }

  onSubmit() {
    this.spinner.show();
    this.EditArea();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

  }




}

