import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AfterMaintenancService } from 'app/services/after-maintenanc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-follow-maint',
  templateUrl: './follow-maint.component.html',
  styleUrls: ['./follow-maint.component.scss']
})
export class FollowMaintComponent implements OnInit {
follow:any;
followMaintForm!: FormGroup;

@ViewChild('followDeleteDialog') followDeleteDialog!: TemplateRef<any>;


  constructor( 
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private afterMainten:AfterMaintenancService,
      private toster:ToastrService,
      private spinner:NgxSpinnerService,
      private dialog : MatDialog,

    ) { }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.follow = params
     });
 

     this.followMaintForm = this.fb.group({
      disc:[this.follow.disc],
      CustomersNum:[this.follow.customersNum],
      deviceSR:[this.follow.deviceSR],
      intro_id:[this.follow.intro_id],
      
     
  
  });
 
  }

  dataUpdated() {
    this.follow.dataUpdated$.subscribe(() => {
    });
  }
  SaveFollowMaint() {

    this.afterMainten.saveFollowMaint(this.followMaintForm.value).subscribe(() => {

    }, error => {
      if(error.status==200)
      {
        this.toster.success("تم حفظ البيانات")
        setTimeout(() => {
          this.afterMainten.GetFollowMaintList();
          this.spinner.hide();
        }, 3000);
        
      }
      else
      {
        this.toster.error("لم يتم حفظ البيانات")
        this.spinner.hide();

      }
      
    });

  }

  
  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.followDeleteDialog);
    
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.afterMainten.deletFollow_maint(id).subscribe(() => {

          
          }
          );
        } else {
        }
      }
    });
  }

  onSubmit(){
  this.spinner.show();
    this.SaveFollowMaint();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

}
}
