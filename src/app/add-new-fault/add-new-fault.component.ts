import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AreaService } from 'app/services/area.service';
import { FaultService } from 'app/services/fault.service';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { WarehousesService } from 'app/services/warehouses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-new-fault',
  templateUrl: './add-new-fault.component.html',
  styleUrls: ['./add-new-fault.component.scss']
})
export class AddNewFaultComponent implements OnInit {
  addFaultForm!: FormGroup;
  constructor(
    private fb:FormBuilder,
    private toster:ToastrService,
    private spinner:NgxSpinnerService,
    private fault:FaultService,
    public dialogRef: MatDialogRef<AddNewFaultComponent>) { }
  


  ngOnInit(): void {
  

    this.addFaultForm = this.fb.group({
      FaultCode: ['', Validators.required],
      FaultNameAr: ['', Validators.required],
      FaultName: [''],
    });
   
 
  }




  onClose() {
    
    this.dialogRef.close();
  }


onSubmit(){
  debugger;
  this.spinner.show();
    this.AddFault();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
} 



  AddFault() {
debugger;
    this.fault.AddNewFault(this.addFaultForm.value).subscribe(() => { }, error => {
      if(error.status==200)
      {
        this.toster.success("تم الاضافة بنجاح")
        setTimeout(() => {
          this.fault.getAllFault();
          this.spinner.hide();
        }, 3000);
        
      }
      else
      {
        this.toster.error("لم يتم الاضافة")
        this.spinner.hide();

      }
      
    });

  }


    
}
