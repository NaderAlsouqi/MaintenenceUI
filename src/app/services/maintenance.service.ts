import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MaintenanceService {

  constructor(private http:HttpClient,private router :Router,private toster:ToastrService,private spinner:NgxSpinnerService) { }
  allAreas:any;
  url=environment.baseUrl;

  getAllarae()
  {
      this.spinner.show();
    this.http.get(this.url+"TblFault/GetFaults").subscribe((res)=>
    {
      this.allAreas=res;
      
      this.spinner.hide();
      //this.toster.success("Data Return")
    }
    ,err=>{
      this.spinner.hide();
      this.toster.error('لم يقم بارجاع البيانات');
    });
    
  }
 
  addArea(model:any){
    
      const fromData=new FormData();
      fromData.append('noCity',model.noCity);                           
      fromData.append('faultsNmAr',model.faultsNmAr);
      fromData.append('city',model.city);
     
  
      return this.http.post(this.url+"TblFault/AddNewFaults",fromData).pipe(
        map((value:any) =>
        {
          
        })
        );
  }
  
  deleteFaults(id:number){
    this.spinner.show();
    this.http.delete(this.url+"TblFault/DeleteFaults/"+id)
    .subscribe((res)=>{
  
     this.getAllarae();
     this.spinner.hide();
  
    },err=>{
  
      if(err.status==200)
      {
        this.toster.success('تم الحذف');
        this.getAllarae();
        this.spinner.hide();
      }
      else
      {
        this.toster.error('لم يتم الحذف');
        this.spinner.hide();
      }
  
    })
  
  
  }

}
