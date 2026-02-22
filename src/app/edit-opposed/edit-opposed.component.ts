import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpposedService } from 'app/services/opposed.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-opposed',
  templateUrl: './edit-opposed.component.html',
  styleUrls: ['./edit-opposed.component.scss']
})

export class EditOpposedComponent implements OnInit {
  OpposedList: string[] = ['معرض','مول'];
  
  editOpposedForm!: FormGroup;
  _exhibition : string = '';

  constructor(
    private fb: FormBuilder,
    private _opposed:OpposedService,
    private toster:ToastrService,
    private spinner:NgxSpinnerService,
    public dialogRef: MatDialogRef<EditOpposedComponent>,
    @Inject(MAT_DIALOG_DATA) public opposed: any
  ) {
  
   }


   ngOnInit(): void {

    if(this.opposed.exhib == '2'){
      this._exhibition = 'معرض'
    }
    else if(this.opposed.exhib == '1'){
      this._exhibition = 'مول'
    }

    this.editOpposedForm = this.fb.group({
      exhibitionID: [this.opposed.exhibitionID, Validators.required],
      exhibitionIDNmAr: [this.opposed.exhibitionIDNmAr, Validators.required],
      mobile1: [this.opposed.mobile1, Validators.required],
      mobile2: [this.opposed.mobile2, Validators.required],
      address: [this.opposed.address, Validators.required],
      exhib: [this._exhibition, Validators.required],
  });
 
  }

  onClose() {
    
    this.dialogRef.close();
  }

  EditOpposed() {
    this._opposed.editopposed(this.editOpposedForm.value).subscribe(() => {

    }, error => {
      if(error.status==200)
      {
        this.toster.success("تم تعديل بيانات المعارض")
        setTimeout(() => {
          this._opposed.getAllExhibition();
          this.spinner.hide();
        }, 3000);
        
      }
      else
      {
        this.toster.error("لم يتم تعديل بيانات المعارض")
        this.spinner.hide();

      }
      
    });

  }



  onSubmit() {
    this.spinner.show();
    this.EditOpposed();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

}
 

}
