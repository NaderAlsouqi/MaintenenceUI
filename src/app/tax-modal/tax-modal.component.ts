import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaxService } from 'app/services/tax.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tax-modal',
  templateUrl: './tax-modal.component.html',
  styleUrls: ['./tax-modal.component.scss']
})
export class TaxModalComponent implements OnInit {

  taxForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taxService: TaxService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<TaxModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.taxForm = this.fb.group({
      taxName: [this.data?.taxName || '', Validators.required],
      taxValue: [this.data?.taxValue || 0, [Validators.required, Validators.min(0)]],
      isPercentage: [this.data?.isPercentage ?? true]
    });
  }

  onSubmit() {
    if (this.taxForm.invalid) return;

    const model = {
      id: this.isEditMode ? this.data.id : 0,
      ...this.taxForm.value
    };

    this.spinner.show();
    this.taxService.saveTax(model).subscribe(
      res => {
        this.spinner.hide();
        this.toastr.success(this.isEditMode ? 'تم التعديل بنجاح' : 'تم الحفظ بنجاح');
        this.dialogRef.close(true);
      },
      err => {
        console.error(err);
        this.spinner.hide();
        this.toastr.error('حدث خطأ أثناء الحفظ');
      }
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
