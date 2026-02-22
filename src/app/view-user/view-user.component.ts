import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})

export class ViewUserComponent implements OnInit {
  hide=true;
  logIn_Statuss:any[] = [{'value': 1 , 'name': 'فعال' },
    {'value': 2 , 'name': 'غير فعال'},];
   
  technicalStatus: any[] = 
  [
  {'value': 0 , 'name': '  غير فعال'},
  {'value': 1 , 'name': 'فعال '},
  ];
  myControl = new FormControl(''); 
  options: string[] = ['مسؤول المتابعة', 'مدير النظام','الاستقبال ', 'المحاسب','سائق ', 'امين مستودع','فني ', 'قائد فريق','مدير صيانة '];
  options1: string[] =[];
  filteredOptions: Observable<string[]>;
  filteredOptions1: Observable<string[]>;
  addNewUserForm!: FormGroup;
  currentDate: any;

  constructor(
    public dialogRef: MatDialogRef<ViewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) { }

  ngOnInit(): void {
  }

 

  onClose(): void {
    this.dialogRef.close();
  }

}
