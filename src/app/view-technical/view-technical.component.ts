import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-technical',
  templateUrl: './view-technical.component.html',
  styleUrls: ['./view-technical.component.scss']
})
export class ViewTechnicalComponent   {
  technicalList: any[] = ["سائق خارجي","سائق داخلي","فني داخلي","فني خارجي"];
  driver_Statuss:any[] = [{'value': 1 , 'name': 'فعال' },
  {'value': 2 , 'name': 'غير فعال'},];
  _techni : string = '';
  _techni2 : string = '';
  constructor(
    public dialogRef: MatDialogRef<ViewTechnicalComponent>,
    @Inject(MAT_DIALOG_DATA) public technical: any
  ) {}
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
  }}
  onClose(): void {
    this.dialogRef.close();
  }

}
