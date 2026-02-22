import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ReportService } from 'app/services/Reportservice';
import { BillsService } from 'app/services/bills.service';
import { MaintenanceManagerService } from 'app/services/maintenance-manager.service';
import { MaintenanceItemService } from 'app/services/maintenance-item.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { InvoiceService } from 'app/services/invoice.service';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import * as moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { TaxService } from 'app/services/tax.service';
import { TaxModalComponent } from 'app/tax-modal/tax-modal.component';
import { ReceiptModalComponent } from 'app/receipt-modal/receipt-modal.component';
import { ReceiptService } from 'app/services/receipt.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  // === USER ROLE ===
  jwtHelper = new JwtHelperService();
  userRole: number;
  isAccountant: boolean = false; // متغير لتحديد إذا كان المستخدم محاسب

  // === ACTIVE TAB ===
  activeTab: number = 0;

  menuItems = [
    { label: 'إنشاء فاتورة', icon: 'receipt_long' },
    { label: 'عرض الفواتير', icon: 'list_alt' },
    { label: 'سندات القبض', icon: 'receipt' },
    { label: 'ترحيل السندات', icon: 'sync_alt' }
  ];


  // === TAB 2: VIEW سند قبض ===
  viewDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  viewDisplayedColumns: string[] = ['maintenanceID', 'end_Date', 'Request_statues', 'tot', 'dis', 'tot_bill', 'action'];
  @ViewChild('viewPaginator') viewPaginator!: MatPaginator;
  @ViewChild('viewSort') viewSort!: MatSort;
  viewBillForm!: FormGroup;
  UserList: any[] = [];
  UserFilteredOptions: Observable<any[]>;
  @ViewChild('UserIdInput') UserIdInput!: ElementRef<HTMLInputElement>;
  selectedId: number | undefined;
  searchedData: any[];

  // === TAB 3: CONVERT سند قبض ===
  convertDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  convertDisplayedColumns: string[] = ['select', 'intro_id', 'billId', 'billDate', 'discount', 'workers', 'taxes', 'total', 'customerName', 'customersNo', 'customerAccNo', 'status'];
  @ViewChild('convertPaginator') convertPaginator!: MatPaginator;
  @ViewChild('convertSort') convertSort!: MatSort;
  convertForm!: FormGroup;
  selection = new SelectionModel<any>(true, []);

  // === BILL CREATE MODAL ===
  billForm!: FormGroup;
  bill: any;
  warehouses: any;
  currentDate: Date;
  @ViewChild('billCreateDialog') billCreateDialog!: TemplateRef<any>;
  @ViewChild('billDeleteDialog') billDeleteDialog!: TemplateRef<any>;
  @ViewChild('newBillDialog') newBillDialog!: TemplateRef<any>;

  taxes: any[] = [];

  constructor(
    public billService: BillsService,
    private dialog: MatDialog,
    private report: ReportService,
    private titleService: Title,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public Users: MaintenanceManagerService,
    private maintenanceItemService: MaintenanceItemService,
    private invoiceService: InvoiceService,
    private taxService: TaxService,
    private receiptService: ReceiptService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('المدير المالي');
    this.currentDate = new Date();

    // Check user role
    const token = localStorage.getItem('token')?.toString();
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        this.userRole = Number(decodedToken.role_id);
        this.isAccountant = this.userRole === 6;

        if (this.userRole !== 6 && this.userRole !== 9) {
          this.toastr.warning('ليس لديك صلاحية الوصول لهذه الصفحة');
          this.router.navigate(['/dashboard']);
          return;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.router.navigate(['auth/login']);
        return;
      }
    } else {
      this.router.navigate(['auth/login']);
      return;
    }

    // Initialize Default Tab (Create Invoice)
    this.initInvoiceForm();


    // Tab 3: View bills form setup
    this.viewBillForm = this.fb.group({
      date1: [null],
      date2: [null],
      UserNmAr: [null],
    });

    this.Users.getTechnicals().subscribe((response: any) => {
      this.UserList = response;
      this.UserFilteredOptions = this.viewBillForm.get('UserNmAr').valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._userFilter(value))
      );
    });

    this.loadTaxes();
    this.loadAllReceipts();

    // Tab 4: Convert form setup
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    this.convertForm = this.fb.group({
      date1: [startOfMonth],
      date2: [endOfMonth],
      status: ['لم يتم التحويل']
    });
    this.loadConvertBills();
  }

  ngAfterViewInit() {
    // Paginators might not be available initially due to *ngIf
    // We handle them in onTabChange
  }

  onTabChange(index: number) {
    this.activeTab = index;

    // Load data based on new index
    if (index === 0) { // Create Invoice
      if (!this.invoiceForm) this.initInvoiceForm();
    } else if (index === 1) { // View Invoices
      this.loadAllInvoices();
    } else if (index === 2) { // View Receipts (New System)
      this.loadAllReceipts();
    } else if (index === 3) { // Convert Receipts
      this.loadConvertBills();
    }

    // Re-bind paginators/sorts after tab change (wait for *ngIf)
    setTimeout(() => {
      // Tab 1: View Invoices
      if (index === 1 && this.invoicesPaginator) {
        this.invoicesDataSource.paginator = this.invoicesPaginator;
        this.invoicesDataSource.sort = this.invoicesSort;
      }
      // Tab 2: View Receipts (New System)
      if (index === 2 && this.receiptsPaginator) {
        this.receiptsDataSource.paginator = this.receiptsPaginator;
        this.receiptsDataSource.sort = this.receiptsSort;
      }
      // Tab 3: Convert Receipts
      if (index === 3 && this.convertPaginator) {
        this.convertDataSource.paginator = this.convertPaginator;
        this.convertDataSource.sort = this.convertSort;
      }
    }, 100);
  }



  // =============================================
  // TAB 2: VIEW سند قبض
  // =============================================
  loadViewBills() {
    this.billService.getBills_list().subscribe((data) => {
      this.viewDataSource.data = data;
      this.searchedData = data;
    });
  }

  searchViewBills() {
    this.Users.searchBill(this.viewBillForm.value).subscribe((data) => {
      this.viewDataSource.data = data;
      this.searchedData = data;
    });
  }

  onViewSearch() {
    this.searchViewBills();
  }

  applyViewFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.viewDataSource.filter = filterValue.trim().toLowerCase();
  }

  private _userFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.UserList.filter(option => option.userNmAr.toLowerCase().includes(filterValue));
  }

  selectUser(option: any) {
    this.viewBillForm.get('UserNmAr').setValue(option.userNmAr);
  }

  viewBillPdf(row: any) {
    this.selectedId = row.intro_id;
    if (this.selectedId !== undefined) {
      this.report.ViewBillStatusPdf(this.selectedId).subscribe((response: any) => {
        const blobResponse: Blob = response.body as Blob;
        const url = window.URL.createObjectURL(blobResponse);
        window.open(url);
      });
    }
  }

  // =============================================
  // TAB 3: CONVERT سند قبض
  // =============================================
  loadConvertBills() {
    let fromDate = this.convertForm.get('date1').value;
    let toDate = this.convertForm.get('date2').value;
    fromDate = moment(fromDate).format('YYYY-MM-DD');
    toDate = moment(toDate).format('YYYY-MM-DD');
    const statusName = this.convertForm.get('status').value;

    this.billService.getBillDetails(fromDate, toDate, statusName).subscribe(
      data => { this.convertDataSource.data = data; },
      error => { this.toastr.error('لم يقم بإرجاع البيانات'); }
    );
  }

  onConvertSearch() {
    this.loadConvertBills();
  }

  applyConvertFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.convertDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyInvoicesFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.invoicesDataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.convertDataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.convertDataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  updateSelectedBillsStatus() {
    const selectedBillIds = this.selection.selected.map(bill => bill.billId);
    if (selectedBillIds.length === 0) {
      this.toastr.warning('لم يتم تحديد أي سندات');
      return;
    }
    this.billService.billUpdateStatus(selectedBillIds, 'تم التحويل').subscribe(
      () => {
        this.toastr.success('تم تحديث حالة السندات بنجاح');
        this.selection.clear();
        this.loadConvertBills();
      },
      error => {
        this.toastr.error('لم يتم تحديث حالة السندات');
      }
    );
  }

  // =============================================
  // SHARED: Download / Print
  // =============================================
  DownloadInvoice() {
    this.report.BillPdf().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'BillPdf.pdf';
        const blob = new Blob([res.body], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => { console.error('Error downloading PDF:', error); }
    );
  }

  PrintInvoice() {
    this.report.BillPdf().subscribe((response: any) => {
      const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
    });
  }

  DownloadViewInvoice() {
    this.report.BillStatusPdf().subscribe(
      (res: any) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const fileName = contentDispositionHeader
          ? contentDispositionHeader.split(';')[1].split('filename=')[1].trim()
          : 'BillStatusPdf.pdf';
        const blob = new Blob([res.body], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => { console.error('Error downloading PDF:', error); }
    );
  }

  PrintViewInvoice() {
    this.report.BillStatusPdf().subscribe((response: any) => {
      const blobResponse: Blob = response.body as Blob;
      const url = window.URL.createObjectURL(blobResponse);
      window.open(url);
    });
  }

  getRequestStatusText(row: any): string {
    if (row.request_statues === 0 && row.technical === 0) return 'لم يتم تحويل الطلب';
    if (row.request_statues === 0 && row.technical !== 0) return 'لم يتم العمل عليه';
    if (row.request_statues === 1) return 'بحاجة الى قطع';
    if (row.request_statues === 2) return 'لاغي';
    if (row.request_statues === 3) return 'تمت الصيانة';
    if (row.request_statues === 4) return 'لم تتم الصيانة';
    if (row.request_statues === 5) return 'موافقة العميل';
    if (row.request_statues === 6) return 'سحب الجهاز';
    if (row.request_statues === 7) return 'منتهي';
    if (row.request_statues === 8) return 'إصدار سند قبض';
    if (row.request_statues === 9) return 'مغلق- المتابعه';
    if (row.request_statues === 10) return 'جديد- المتابعة';
    if (row.request_statues === 11) return 'مغلق -إصدار سند قبض';
    return '';
  }

  getStatusClass(row: any): string {
    if (row.request_statues === 3 || row.request_statues === 7) return 'status-done';
    if (row.request_statues === 2 || row.request_statues === 4) return 'status-cancelled';
    if (row.request_statues === 8 || row.request_statues === 11) return 'status-bill';
    if (row.request_statues === 1 || row.request_statues === 5 || row.request_statues === 6) return 'status-warning';
    if (row.request_statues === 0) return 'status-pending';
    return 'status-default';
  }

  // =============================================
  // TAB 4: CREATE INVOICE (فاتورة)
  // =============================================
  invoiceForm!: FormGroup;
  maintenanceIdControl = new FormControl('');

  // Tab 5 (View Invoices)
  invoicesDataSource = new MatTableDataSource<any>([]);
  invoicesDisplayedColumns: string[] = ['invoiceId', 'invoiceDate', 'customerName', 'totalAmount', 'action'];
  @ViewChild('invoicesSort') invoicesSort!: MatSort;
  @ViewChild('invoicesPaginator') invoicesPaginator!: MatPaginator;

  // New Receipts Tab
  receiptsDataSource = new MatTableDataSource<any>([]);
  receiptsDisplayedColumns: string[] = ['id', 'receiptNumber', 'receiptDate', 'customerName', 'invoiceTotal', 'amountPaid', 'paymentMethod', 'notes', 'actions'];
  @ViewChild('receiptsSort') receiptsSort!: MatSort;
  @ViewChild('receiptsPaginator') receiptsPaginator!: MatPaginator;

  // Invoice View Modal
  selectedInvoice: any;
  @ViewChild('invoiceViewDialog') invoiceViewDialog!: TemplateRef<any>;

  viewInvoice(row: any) {
    this.spinner.show();
    // Fetch full details including items
    this.invoiceService.getInvoiceById(row.id).subscribe(
      res => {
        this.selectedInvoice = res;
        this.spinner.hide();
        this.dialog.open(this.invoiceViewDialog, {
          width: '800px',
          maxHeight: '90vh',
          panelClass: 'custom-dialog-container',
          direction: 'rtl'
        });
      },
      err => {
        console.error(err);
        this.spinner.hide();
        this.toastr.error('فشل تحميل تفاصيل الفاتورة');
      }
    );
  }

  initInvoiceForm() {
    this.invoiceForm = this.fb.group({
      invoiceDate: [new Date(), Validators.required],
      customerName: ['', Validators.required],
      customerPhone: [''],
      notes: [''],
      items: this.fb.array([]),
      laborCost: [0], // Added Labor Cost
      subTotal: [0],
      taxId: [null],
      taxAmount: [0],
      discountAmount: [0],
      totalAmount: [0]
    });
    // Add initial item row
    this.addInvoiceItem();

    // Subscribe to changes for calculation
    this.invoiceForm.valueChanges.subscribe(() => {
      this.calculateInvoiceTotal();
    });
  }

  loadInvoiceFromMaintenance() {
    const idStr = this.maintenanceIdControl.value;
    if (!idStr) {
      this.toastr.warning('الرجاء إدخال رقم الصيانة');
      return;
    }
    const id = Number(idStr);

    this.spinner.show();

    // 1. Get Maintenance Info (Customer)
    this.billService.getBillById(id).subscribe((res: any) => {
      // Handle array response (API returns List<BillDTO> or similar)
      const data = Array.isArray(res) && res.length > 0 ? res[0] : res;

      if (data) {
        this.invoiceForm.patchValue({
          customerName: data.customers_FName1 || data.Customers_FName1 || '',
          customerPhone: data.Customers_phone1 || data.customers_phone1 || '',
          invoiceDate: new Date()
        });

        // 2. Get Parts and Labor
        this.maintenanceItemService.getMaintenanceItems(id).subscribe((parts: any[]) => {
          this.spinner.hide();
          // Clear existing items
          const itemsArray = this.invoiceForm.get('items') as FormArray;
          itemsArray.clear();

          // Add Parts loaded from Maintenance
          if (parts && parts.length > 0) {
            parts.forEach((p: any) => {
              // Handle potential case differences and string types
              const name = p.ItemName || p.itemName || 'قطعة';
              const qtyRaw = p.Quantity || p.quantity || 1;
              const priceRaw = p.Price || p.price || 0;

              const qty = Number(qtyRaw) || 1;
              const price = Number(priceRaw) || 0;

              const itemGroup = this.fb.group({
                itemName: [name, Validators.required],
                quantity: [qty, [Validators.required, Validators.min(1)]],
                price: [price, [Validators.required, Validators.min(0)]],
                total: [qty * price]
              });
              itemsArray.push(itemGroup);
            });
          }

          // Set Labor Cost Field (instead of adding as line item)
          if (data.workers && data.workers > 0) {
            this.invoiceForm.patchValue({ laborCost: data.workers });
          }

          // If no items found, add an empty row
          if (itemsArray.length === 0) {
            this.addInvoiceItem();
          }

          this.calculateInvoiceTotal();
          this.toastr.success('تم تحميل بيانات الصيانة بنجاح');

        }, err => {
          this.spinner.hide();
          // Even if parts fail, we might have customer info
          this.toastr.warning('تم تحميل بيانات العميل، لكن لم يتم العثور على قطع');
        });

      } else {
        this.spinner.hide();
        this.toastr.error('رقم الصيانة غير موجود');
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error('حدث خطأ أثناء البحث عن رقم الصيانة');
    });
  }

  get invoiceItems(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addInvoiceItem() {
    const itemGroup = this.fb.group({
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [0]
    });
    this.invoiceItems.push(itemGroup);
  }

  removeInvoiceItem(index: number) {
    this.invoiceItems.removeAt(index);
    this.calculateInvoiceTotal();
  }

  calculateInvoiceTotal() {
    let subTotal = 0;
    this.invoiceItems.controls.forEach(control => {
      const qty = control.get('quantity')?.value || 0;
      const price = control.get('price')?.value || 0;
      const total = qty * price;
      control.get('total')?.setValue(total, { emitEvent: false });
      subTotal += total;
    });

    const labor = this.invoiceForm.get('laborCost')?.value || 0;
    const subTotalWithLabor = subTotal + labor;

    // Calculate Tax based on selection
    let tax = 0;
    const selectedTaxId = this.invoiceForm.get('taxId')?.value;
    if (selectedTaxId) {
      const selectedTax = this.taxes.find(t => t.id === selectedTaxId);
      if (selectedTax) {
        if (selectedTax.isPercentage) {
          tax = subTotalWithLabor * (selectedTax.taxValue / 100);
        } else {
          tax = selectedTax.taxValue;
        }
      }
    }

    const discount = this.invoiceForm.get('discountAmount')?.value || 0;
    const finalTotal = subTotalWithLabor + tax - discount;

    this.invoiceForm.patchValue({
      subTotal: subTotal,
      taxAmount: tax,
      totalAmount: finalTotal
    }, { emitEvent: false });
  }

  saveInvoice() {
    if (this.invoiceForm.invalid) {
      this.toastr.warning('يرجى تعبئة الحقول المطلوبة');
      return;
    }

    const invoiceData = this.invoiceForm.value;

    // Convert to DTO format if needed (PascalCase mapping)
    const dto = {
      InvoiceDate: invoiceData.invoiceDate,
      CustomerName: invoiceData.customerName,
      CustomerPhone: invoiceData.customerPhone,
      Notes: invoiceData.notes,
      LaborCost: invoiceData.laborCost, // Map new field
      SubTotal: invoiceData.subTotal,
      TaxAmount: invoiceData.taxAmount,
      DiscountAmount: invoiceData.discountAmount,
      TotalAmount: invoiceData.totalAmount,
      Items: invoiceData.items.map((i: any) => ({
        ItemName: i.itemName,
        Quantity: i.quantity,
        Price: i.price,
        Total: i.total
      }))
    };

    this.spinner.show();

    this.invoiceService.createInvoice(dto).subscribe(
      res => {
        this.toastr.success('تم إنشاء الفاتورة بنجاح');
        this.spinner.hide();
        this.initInvoiceForm(); // Reset
      },
      err => {
        console.error(err);
        this.toastr.error('فشل إنشاء الفاتورة');
        this.spinner.hide();
      }
    );
  }

  // =============================================
  // TAB 5: VIEW INVOICES
  // =============================================
  loadAllInvoices() {
    this.spinner.show();
    this.invoiceService.getInvoices().subscribe(
      res => {
        this.invoicesDataSource.data = res;
        this.invoicesDataSource.sort = this.invoicesSort;
        this.invoicesDataSource.paginator = this.invoicesPaginator;
        this.spinner.hide();
      },
      err => {
        console.error(err);
        this.spinner.hide();
        this.toastr.error('فشل تحميل الفواتير');
      }
    );
  }

  deleteInvoice(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      this.spinner.show();
      this.invoiceService.deleteInvoice(id).subscribe(
        res => {
          this.toastr.success('تم حذف الفاتورة بنجاح');
          this.loadAllInvoices();
        },
        err => {
          console.error(err);
          this.spinner.hide();
          this.toastr.error('فشل حذف الفاتورة');
        }
      );
    }
  }

  loadTaxes() {
    this.taxService.getTaxes().subscribe(res => {
      this.taxes = res;
    });
  }

  openAddTaxModal() {
    const dialogRef = this.dialog.open(TaxModalComponent, {
      width: '500px',
      direction: 'rtl'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTaxes();
      }
    });
  }

  // === NEW RECEIPTS LOGIC ===
  loadAllReceipts() {
    this.spinner.show();
    this.receiptService.getAllReceipts().subscribe(data => {
      this.receiptsDataSource.data = data;
      this.receiptsDataSource.sort = this.receiptsSort;
      this.receiptsDataSource.paginator = this.receiptsPaginator;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error('فشل تحميل السندات');
    });
  }


  openCreateReceiptModal(invoice: any) {
    const dialogRef = this.dialog.open(ReceiptModalComponent, {
      width: '600px',
      direction: 'rtl',
      data: { invoice: invoice }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAllReceipts();
      }
    });
  }

  deleteReceipt(id: number) {
    if (confirm('هل أنت متأكد من حذف هذا السند؟')) {
      this.spinner.show();
      this.receiptService.deleteReceipt(id).subscribe(() => {
        this.spinner.hide();
        this.toastr.success('تم حذف السند بنجاح');
        this.loadAllReceipts();
      }, err => {
        this.spinner.hide();
        this.toastr.error('فشل حذف السند');
      });
    }
  }

  applyReceiptsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.receiptsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.receiptsDataSource.paginator) {
      this.receiptsDataSource.paginator.firstPage();
    }
  }
}
