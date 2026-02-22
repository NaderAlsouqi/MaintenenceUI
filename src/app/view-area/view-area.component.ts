import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-area',
  templateUrl: './view-area.component.html',
  styleUrls: ['./view-area.component.scss']
})

export class ViewAreaComponent implements OnInit {
  
  cityList: string[] = [
    "عمان","الزرقاء","اربد","عجلون","جرش ","معان",
    "الكرك","العقبة","الطفيلة","البلقاء","مادبا ","المفرق"
  ]

  selected:string;
  constructor(
    public dialogRef: MatDialogRef<ViewAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public area: any
  ) {}
  
  ngOnInit(): void {
    
  }

  onClose(): void {
    this.dialogRef.close();
  }

}