import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ActivatedRoute, Router } from '@angular/router';
import { FaultService } from 'app/services/fault.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


  

@Component({
  selector: 'app-edit-fault',
  templateUrl: './edit-fault.component.html',
  styleUrls: ['./edit-fault.component.scss']
                 
})
export class EditFaultComponent implements OnInit {

  editFaultForm!: FormGroup;

  constructor(
    private fb: FormBuilder,    
    private _fault:FaultService,
    private toster:ToastrService,
    private spinner:NgxSpinnerService, 
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<EditFaultComponent>,
 @Inject(MAT_DIALOG_DATA) public fault: any) { }

  ngOnInit(): void {

  this.editFaultForm = this.fb.group({
   FaultsID: [this.fault.faultsID, Validators.required],
   FaultCode: [this.fault.faultCode, Validators.required],
   FaultNameAr: [this.fault.faultNameAr, Validators.required],
   FaultName: [this.fault.faultName, Validators.required],
});

}



EditFault() {
  this._fault.UpdateFault(this.editFaultForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toster.success("تم تعديل المنطقة")
      setTimeout(() => {
        this.fault.getAllFault();
        this.spinner.hide();
      }, 3000);
      
    }
    else
    {
      this.toster.error("لم يتم تعديل المنطقة")
      this.spinner.hide();

    }
    
  });

}

onClose() {    
  this.dialogRef.close();
}

onSubmit() {
  this.spinner.show();
  this.EditFault();
  setTimeout(() => {

    this.spinner.hide();
  }, 5000);

}


  
 
  }

 