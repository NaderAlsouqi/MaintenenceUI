import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-content',
  template: `
    <div>
      <!-- Your dialog content here -->
      <iframe [src]="data.pdfurl" frameborder="0" style="width: 100%; height: 500px;"></iframe>
    </div>
  `,
})
export class DialogContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { pdfurl: string }) {}
}
