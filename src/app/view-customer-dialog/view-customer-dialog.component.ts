import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-customer-dialog',
  templateUrl: './view-customer-dialog.component.html',
  styleUrls: ['./view-customer-dialog.component.scss']

})
export class ViewCustomerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customer: any
  ) {}
  logIn_Statuss:any[] = [{'value': 1 , 'name': 'فعال' },
  {'value': 2 , 'name': 'غير فعال'},];
 
  onClose(): void {
    this.dialogRef.close();
  }

}
