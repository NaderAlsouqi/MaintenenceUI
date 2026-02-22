import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vewi-device-dec',
  templateUrl: './vewi-device-dec.component.html',
  styleUrls: ['./vewi-device-dec.component.scss']
})
export class VewiDeviceDECComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<VewiDeviceDECComponent>,
    @Inject(MAT_DIALOG_DATA) public device: any) { }

  ngOnInit(): void {
  }

}
