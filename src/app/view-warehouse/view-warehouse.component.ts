import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-warehouse',
  templateUrl: './view-warehouse.component.html',
  styleUrls: ['./view-warehouse.component.scss']
})

export class ViewWarehouseComponent implements OnInit {

  cityList: string[] = [
    "عمان","الزرقاء","اربد","عجلون","جرش ","معان",
    "الكرك","العقبة","الطفيلة","البلقاء","مادبا ","المفرق"
  ]
  selected:string;

  constructor(
    public dialogRef: MatDialogRef<ViewWarehouseComponent>,
    @Inject(MAT_DIALOG_DATA) public Warehouse: any
  ) {}

  ngOnInit(): void {
    
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
