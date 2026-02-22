import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BillsService } from 'app/services/bills.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bill-maintenanc',
  templateUrl: './bill-maintenanc.component.html',
  styleUrls: ['./bill-maintenanc.component.scss']
})
export class BillMaintenancComponent implements OnInit {
  currentDate: Date;
  billForm!: FormGroup;
  bill: any;

  warehouses: any;
  @ViewChild('billDeleteDialog') billDeleteDialog!: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    public bills: BillsService,
    private fb: FormBuilder,
    private toster: ToastrService,
    private dialog : MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router ) { }

  ngOnInit(): void {
    this.currentDate = new Date();
   
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      this.bills.GetDataWarehouse(id).subscribe((res) => {
        this.warehouses = res;
        console.log( this.warehouses)
      });

      this.bills.getBillById(id).subscribe((res) => {
        this.bill = res;

        this.initializeForm();
      });
    });
  }
  initializeForm(): void {
    let isDateBillEmpty = (this.bill.dateBill != null && this.bill.dateBill !== '');
    let dateBillValue = isDateBillEmpty ? this.currentDate : this.bill.dateBill;

    this.billForm = this.fb.group({
      intro_id: [this.bill.intro_id],
      workers: [this.bill.workers],
      tax: [this.bill.tax],
      customers_FName1: [this.bill.customers_FName1],
      userNmAr: [this.bill.userNmAr],
      exhibitionIDNmAr: [''],
      tott: [(this.bill.tott != null) ? this.bill.tott: 0 ],
      dis: [this.bill.dis],
      tot_bill:[0],
      idBill:[''],
      dateBill:[this.currentDate],
    });

    this.calculateTotBill(); // Calculate total bill initially
    this.subscribeToFormChanges(); // Subscribe to form changes for real-time updates
  }

  subscribeToFormChanges(): void {
    this.billForm.valueChanges.subscribe(() => {
      this.calculateTotBill();
    });
  }

  calculateTotBill(): void {
    const tott = parseFloat(this.billForm.get('tott').value);
    const workers = parseFloat(this.billForm.get('workers').value);
    const dis = parseFloat(this.billForm.get('dis').value);
    const tax = parseFloat(this.billForm.get('tax').value);

    const totBillValue = tott - dis + workers + tax;
    this.billForm.get('tot_bill').setValue(totBillValue);
  }

  AddBill() {
    const formattedDate = this.currentDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    this.billForm.get('dateBill').setValue(formattedDate);
    
    
    this.bills.addBill(this.billForm.value).subscribe(() => {
      // Your success logic
      this.toster.success('تم انشاء سند قبض ');

    }, error => {
      // Your error handling logic
      this.toster.success('تم انشاء سند قبض ');

    });
  }

  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.billDeleteDialog);
    
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.bills.DeleteBill(id).subscribe(() => {

          
          }
          );
        } else {
        }
      }
    });
  }
  onSubmit() {
    this.spinner.show();
    this.AddBill();
    this.router.navigate(['/bills']);     setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }
}
