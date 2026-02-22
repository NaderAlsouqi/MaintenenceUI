import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-view-fault',
  templateUrl: './view-fault.component.html',
  styleUrls: ['./view-fault.component.scss']
})

export class ViewFaultComponent implements OnInit {
  

  selected:string;
  constructor(
    public dialogRef: MatDialogRef<ViewFaultComponent>,
    @Inject(MAT_DIALOG_DATA) public fault: any
  ) {}
  
  ngOnInit(): void {
    
  }

  onClose(): void {
    this.dialogRef.close();
  }

}