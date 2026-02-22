import { Component, OnInit, ViewChild } from '@angular/core';
import { TaxService } from 'app/services/tax.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from 'app/services/log.service';
import { AuthService } from 'app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tax-definition',
  templateUrl: './tax-definition.component.html',
  styleUrls: ['./tax-definition.component.scss']
})
export class TaxDefinitionComponent implements OnInit {

  displayedColumns: string[] = ['id', 'taxName', 'taxValue', 'isPercentage', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  taxForm!: FormGroup;
  isEditMode: boolean = false;
  editingId: number = 0;

  constructor(
    private taxService: TaxService,
    private logService: LogService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllTaxes();
  }

  initForm() {
    this.taxForm = this.fb.group({
      taxName: ['', Validators.required],
      taxValue: [0, [Validators.required, Validators.min(0)]],
      isPercentage: [true]
    });
  }

  getAllTaxes() {
    this.spinner.show();
    this.taxService.getTaxes().subscribe(
      res => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      err => {
        console.error(err);
        this.spinner.hide();
        this.toastr.error('فشل في جلب البيانات');
      }
    );
  }

  onSubmit() {
    if (this.taxForm.invalid) return;

    const model = {
      id: this.isEditMode ? this.editingId : 0,
      ...this.taxForm.value
    };

    this.spinner.show();
    this.taxService.saveTax(model).subscribe(
      res => {
        this.spinner.hide();
        const actionText = this.isEditMode ? 'تحديث ضريبة' : 'إضافة ضريبة جديدة';
        const details = `${actionText}: ${model.taxName} (القيمة: ${model.taxValue}${model.isPercentage ? '%' : ' ريال'})`;
        const logId = this.isEditMode ? model.id : res;
        this.logUserAction(actionText, details, 'Taxes', logId || 0);

        this.toastr.success(this.isEditMode ? 'تم التعديل بنجاح' : 'تم الحفظ بنجاح');
        this.onCancel();
        this.getAllTaxes();
      },
      err => {
        console.error(err);
        this.spinner.hide();
        this.toastr.error('حدث خطأ أثناء الحفظ');
      }
    );
  }

  onEdit(row: any) {
    this.isEditMode = true;
    this.editingId = row.id;
    this.taxForm.patchValue({
      taxName: row.taxName,
      taxValue: row.taxValue,
      isPercentage: row.isPercentage
    });
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تتمكن من التراجع عن هذا!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.taxService.deleteTax(id).subscribe(
          res => {
            this.spinner.hide();
            if (res) {
              this.logUserAction('حذف ضريبة', `تم حذف الضريبة ذات الرقم المعرف: ${id}`, 'Taxes', id);
              this.toastr.success('تم الحذف بنجاح');
              this.getAllTaxes();
            } else {
              this.toastr.error('فشل الحذف');
            }
          },
          err => {
            console.error(err);
            this.spinner.hide();
            this.toastr.error('حدث خطأ أثناء الحذف');
          }
        );
      }
    });
  }

  logUserAction(action: string, details: string, entityName: string, entityId: number) {
    const userId = this.authService.getUserId();
    const token = localStorage.getItem('token');
    let userName = 'Unknown';

    if (token) {
      const decoded = this.authService.jwtHelper.decodeToken(token);
      userName = decoded.unique_name || decoded.name || 'Unknown';
    }

    const logEntry = {
      action: action,
      userId: userId,
      userName: userName,
      details: details,
      entityName: entityName,
      entityId: entityId
    };

    this.logService.saveLog(logEntry).subscribe({
      next: () => console.log('Action logged successfully'),
      error: (err) => console.error('Error logging action:', err)
    });
  }

  onCancel() {
    this.isEditMode = false;
    this.editingId = 0;
    this.taxForm.reset({ isPercentage: true, taxValue: 0 });
  }
}
