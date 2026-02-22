import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReceiptService } from 'app/services/receipt.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.scss']
})
export class ReceiptModalComponent implements OnInit {
  // Last Updated: 2024-02-22 11:15 AM

  receiptForm!: FormGroup;
  currentDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private receiptService: ReceiptService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ReceiptModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // data.invoice
  ) { }

  ngOnInit(): void {
    this.receiptForm = this.fb.group({
      invoiceId: [this.data.invoice.id, Validators.required],
      receiptNumber: ['', Validators.required],
      receiptDate: [this.currentDate, Validators.required],
      amountPaid: [this.data.invoice.totalAmount, [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['Cash', Validators.required],
      notes: ['']
    });

    // Auto-generate a receipt number
    const timestamp = new Date().getTime().toString().slice(-6);
    const invId = this.data?.invoice?.id || this.data?.invoice?.Id;
    this.receiptForm.patchValue({
      receiptNumber: `REC-${invId}-${timestamp}`
    });
  }

  onSubmit() {
    if (this.receiptForm.invalid) {
      console.warn('Form is invalid:', this.receiptForm.errors);
      return;
    }

    const formVal = this.receiptForm.value;

    // Map to PascalCase for the C# DTO
    const receiptDto = {
      InvoiceId: formVal.invoiceId,
      ReceiptNumber: formVal.receiptNumber,
      ReceiptDate: formVal.receiptDate,
      AmountPaid: formVal.amountPaid,
      PaymentMethod: formVal.paymentMethod,
      Notes: formVal.notes
    };

    console.log('Sending Receipt DTO:', receiptDto);

    this.spinner.show();
    this.receiptService.saveReceipt(receiptDto).subscribe(
      res => {
        this.spinner.hide();
        this.toastr.success('تم إنشاء سند القبض بنجاح');
        this.dialogRef.close(true);
      },
      err => {
        console.error(err);
        this.spinner.hide();
        this.toastr.error('حدث خطأ أثناء حفظ سند القبض');
      }
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
