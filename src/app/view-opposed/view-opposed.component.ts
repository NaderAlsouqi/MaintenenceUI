import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-view-opposed',
  templateUrl: './view-opposed.component.html',
  styleUrls: ['./view-opposed.component.scss']
})

export class ViewOpposedComponent implements OnInit {
  OpposedList: string[] = ["مول ","معرض"];
  _exhibition : string = '';

   constructor(
    public dialogRef: MatDialogRef<ViewOpposedComponent>,
    @Inject(MAT_DIALOG_DATA) public opposed: any
  ) {}

  ngOnInit(): void {
    if(this.opposed.exhib == '2'){
      this._exhibition = 'معرض'
    }
    else if(this.opposed.exhib == '1'){
      this._exhibition = 'مول'
    }

    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.OpposedList.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  onClose(): void {
    this.dialogRef.close();
  }

}
