import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OpposedService } from 'app/services/opposed.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-opposed',
  templateUrl: './add-opposed.component.html',
  styleUrls: ['./add-opposed.component.scss']
})
export class AddOpposedComponent implements OnInit {

  OpposedList: string[] = ['معرض', 'مول'];

  addOpposedForm!: FormGroup;


  constructor(private fb: FormBuilder, private opposed: OpposedService,
    private toster: ToastrService, private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddOpposedComponent>) { }



  ngOnInit(): void {


    this.addOpposedForm = this.fb.group({
      exhibitionID: ['',],
      exhibitionIDNmAr: ['', Validators.required],
      mobile1: ['', Validators.required],
      mobile2: [''],
      address: ['', Validators.required],
      exhib: ['', Validators.required],


    });

  }


  AddOpposed() {

    this.opposed.addOpposed(this.addOpposedForm.value).subscribe(() => {

    }, error => {
      if (error.status == 200) {
        this.toster.success("تم اضافة معرض جديد")
        setTimeout(() => {
          this.opposed.getAllExhibition();
          this.spinner.hide();
          this.dialogRef.close(true); // Close dialog with success result after 1 second
        }, 1000);

      }
      else {
        this.toster.error("لم يتم اضافه معرض")
        this.spinner.hide();

      }

    });

  }

  onClose() {

    this.dialogRef.close();
  }
  Submit() {
    this.spinner.show();
    this.AddOpposed();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

  }
}
