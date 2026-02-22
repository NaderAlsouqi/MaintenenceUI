import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-new-item',
  templateUrl: './view-new-item.component.html',
  styleUrls: ['./view-new-item.component.scss']
})

export class ViewNewItemComponent implements OnInit {

  cityList: string[] = [
    "عمان","الزرقاء","اربد","عجلون","جرش ","معان",
    "الكرك","العقبة","الطفيلة","البلقاء","مادبا ","المفرق"
  ]
  selected:string;

  constructor(
    public dialogRef: MatDialogRef<ViewNewItemComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {}

  ngOnInit(): void {
    
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
