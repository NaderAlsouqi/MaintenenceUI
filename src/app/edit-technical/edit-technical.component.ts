import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaintenanceTechnicianService } from 'app/services/maintenance-technician.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-technical',
  templateUrl: './edit-technical.component.html',
  styleUrls: ['./edit-technical.component.scss']
})
export class EditTechnicalComponent implements OnInit {
  technicalList: string[] = ["سائق خارجي","سائق داخلي","فني داخلي","فني خارجي"];
  Driver_Statuss:any[] = [{'value': 1 , 'name': 'فعال' },
  {'value': 2 , 'name': 'غير فعال'},];
  editTechnicalForm!: FormGroup;
  _techni : string = '';
  _techni2 : string = '';


  constructor(
    private fb: FormBuilder,
    private _technical:MaintenanceTechnicianService,
    private toster:ToastrService,
    private spinner:NgxSpinnerService,
    public dialogRef: MatDialogRef<EditTechnicalComponent>,
    @Inject(MAT_DIALOG_DATA) public technical: any
  ) { }

  ngOnInit(): void {
      if(this.technical.driver_Status =='1'){
        this._techni2 = 'فعال'
      }
      else if(this.technical.driver_Status == '0'){
        this._techni2 = 'غير فعال'
      }
    if(this.technical.driv =='1'){
      this._techni = 'سائق داخلي'
    }
    else if(this.technical.driv == '2'){
      this._techni = 'سائق خارجي'
    }
    else if(this.technical.driv == '3'){
      this._techni = 'فني داخلي'
    }
    else if(this.technical.driv == '4'){
      this._techni = 'فني خارجي'
    }

    this.editTechnicalForm = this.fb.group({
      driver_ID: [this.technical.driver_ID, Validators.required],
      num_Driver: [this.technical.num_Driver, Validators.required],
      name_Driver: [this.technical.name_Driver, Validators.required],
      address: [this.technical.address, Validators.required],
      disc: [this.technical.disc, Validators.required],
      Driver_Status: [this.technical.driver_Status],
      driv: [this._techni],
  
  });
 
  }
  onClose() {
    
    this.dialogRef.close();
  }

  onEmergencyStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus === 'فعال') {
      this.editTechnicalForm.controls.Driver_Status.setValue('فعال');
    } else if (selectedStatus === 'غير فعال') {
      this.editTechnicalForm.controls.Driver_Status.setValue('غير فعال');
    }
  } 


  EditTechnical() {
    this._technical.editTechnical(this.editTechnicalForm.value).subscribe(() => {

    }, error => {
      if(error.status==200)
      {
        this.toster.success("تم تعديل بيانات الفني ")
        setTimeout(() => {
          this._technical.getAlltechnician();

          this.spinner.hide();
        }, 3000);
 
      }
      else
      {
        this.toster.error("لم يتم تعديل بيانات الفني")
        this.spinner.hide();

      }
      
    });

  }



  onSubmit() {
    this.spinner.show();
    this.EditTechnical();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

}
}