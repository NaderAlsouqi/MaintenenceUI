import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-representative',
  templateUrl: './view-representative.component.html',
  styleUrls: ['./view-representative.component.scss']
})

export class ViewRepresentativeComponent  {
  molesList: string[] = [" "];

  constructor(
    public dialogRef: MatDialogRef<ViewRepresentativeComponent>,
    @Inject(MAT_DIALOG_DATA) public representative: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

}
