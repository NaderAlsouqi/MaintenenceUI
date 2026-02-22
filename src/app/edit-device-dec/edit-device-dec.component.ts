import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from 'app/services/area.service';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-device-dec',
  templateUrl: './edit-device-dec.component.html',
  styleUrls: ['./edit-device-dec.component.scss']
})
export class EditDeviceDECComponent implements OnInit {
  editDeviceForm!: FormGroup;
 
  constructor(
    private fb: FormBuilder,    
    private requests:MaintenanceRequestsService,
    private toster:ToastrService,
    private spinner:NgxSpinnerService, 
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<EditDeviceDECComponent>,
 @Inject(MAT_DIALOG_DATA) public device: any) { }

  ngOnInit(): void {

  this.editDeviceForm = this.fb.group({
    id: [this.device.id, Validators.required],
    devicePro_ID : [this.device.devicePro_ID,],
    deviceType_ID: [this.device.deviceType_ID,],
    deviceModel_ID: [this.device.deviceModel_ID,],
    devicePor : [this.device.devicePor,],
    deviceType_Name: [this.device.deviceType_Name, ],
    deviceModel_Name: [this.device.deviceModel_Name, ],

});

}



EditDeviceDEC() {
  this.requests.EditDeviceDEC(this.editDeviceForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toster.success("تم تعديل الجهاز")
      setTimeout(() => {
        this.requests.getAllDeviceDEC();
        this.spinner.hide();
      }, 3000);
      
    }
    else
    {
      this.toster.error("لم يتم تعديل الجهاز")
      this.spinner.hide();

    }
    
  });

}

onClose() {
    
  this.dialogRef.close();
}

onSubmit() {
  this.spinner.show();
  this.EditDeviceDEC();

  setTimeout(() => {

    this.spinner.hide();
  }, 5000);

}


  
 
  }

 