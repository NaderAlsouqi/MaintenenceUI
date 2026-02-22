import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaintenanceTechnicianService } from 'app/services/maintenance-technician.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-technical',
  templateUrl: './add-technical.component.html',
  styleUrls: ['./add-technical.component.scss']
})
export class AddTechnicalComponent implements OnInit {
  technicalList: string[] = ["سائق خارجي","سائق داخلي","فني داخلي","فني خارجي"];
  Driver_Statuss:any[] = [{'value': 1 , 'name': 'فعال' },
  {'value': 2 , 'name': 'غير فعال'},];


  addTechnicalForm!: FormGroup;
  Driver_Status='1' ;
  Status={value: 1, name: 'فعال'} ;

  constructor(private fb: FormBuilder,private technical:MaintenanceTechnicianService,
    private toster:ToastrService,private spinner:NgxSpinnerService, public dialogRef: MatDialogRef<AddTechnicalComponent>) { }





    ngOnInit(): void {
     
      this.addTechnicalForm = this.fb.group({
        num_Driver: ['', Validators.required],
        name_Driver: ['', Validators.required],
        address: ['', Validators.required],
        phone: ['', Validators.required],
        disc: ['',],
        Driver_Status: [this.Status],
        driv: ['', Validators.required],


      });
   
    }  
  

    onEmergencyStatusChange(event: any) {
      const selectedStatus = event.value;
      if (selectedStatus === 'فعال') {
        this.addTechnicalForm.controls.Driver_Status.setValue(1);
      } else if (selectedStatus === 'غير فعال') {
        this.addTechnicalForm.controls.Driver_Status.setValue(2);
      }
    }  
    onClose() {
    
      this.dialogRef.close();
    }
    AddTechnical() {
      this.technical.addTechnical(this.addTechnicalForm.value).subscribe(() => {
  
      }, error => {
        if(error.status==200)
        {
          this.toster.success("تم اضافة فني جديد")
          setTimeout(() => {
            this.technical.getAlltechnician();
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
  
  
  onSubmit(){
    this.spinner.show();
      this.AddTechnical();
  
      setTimeout(() => {
  
        this.spinner.hide();
      }, 5000);
  
  }



 




}