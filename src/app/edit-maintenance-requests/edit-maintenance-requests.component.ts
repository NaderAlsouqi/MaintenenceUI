import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_OPTION_PARENT_COMPONENT } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddOpposedComponent } from 'app/add-opposed/add-opposed.component';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { AddDeviceDECComponent } from 'app/add-device-dec/add-device-dec.component';

@Component({
  selector: 'app-edit-maintenance-requests',
  templateUrl: './edit-maintenance-requests.component.html',
  styleUrls: ['./edit-maintenance-requests.component.scss']
})
export class EditMaintenanceRequestsComponent implements OnInit {
  customerStatus: string[] = ['فعال', 'غير فعال'];
  MStatus: any[] =
    [
      { 'value': 0, 'name': 'صيانة طارئة' },
      { 'value': 1, 'name': 'غير طارئة' },
    ];
  MStatus2: any[] = [
    { 'value': 0, 'name': 'داخلية ' },
    { 'value': 1, 'name': ' خارجية' },
  ];
  MStatus3: any[] = [
    { 'value': 0, 'name': ' مشكوك' },
    { 'value': 1, 'name': ' غير مكفول' },
    { 'value': 2, 'name': ' مكفول ' },];
  areaList: string[] = [' '];
  cityList: string[] = [
    'عمان', 'الزرقاء', 'اربد', 'عجلون', 'جرش', 'معان',
    'الكرك', 'العقبة', 'الطفيلة', 'البلقاء', 'مادبا', 'المفرق'
  ];

  customerName: any = '';
  customersNum: string = '';
  customersAddress: any;
  prevCustomerNum: string = '';

  customerData: any;

  isEnterPressed: boolean;
  s1: string;
  ExhibitionList: any[] = [];
  ProductList: any[] = [];
  TypeList: any[] = [];
  ModelList: any[] = [];
  myControl = new FormControl();
  ExhibitionFilteredOptions: Observable<any[]>;
  ProductFilteredOptions: Observable<any[]>;
  TypeFilteredOptions: Observable<any[]>;
  ModelFilteredOptions: Observable<any[]>;

  currentDate: Date;
  lastIntroID: number;

  editIntroForm!: FormGroup;

  typeAuto: MatAutocompleteTrigger;
  modelAuto: MatAutocompleteTrigger;
  request: any;
  constructor(
    private fb: FormBuilder,
    public requests: MaintenanceRequestsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  @ViewChild('exhibitionInput') exhibitionInput!: ElementRef<HTMLInputElement>;
  @ViewChild('productInput') productInput!: ElementRef<HTMLInputElement>;
  @ViewChild('typeInput') typeInput!: ElementRef<HTMLInputElement>;


  ngOnInit(): void {


    this.route.queryParams.subscribe(params => {

      this.request = params
    });



    //Exhibition Code For Retrieving the data.
    this.loadExhibitions();

    //Product Code For Filtering And Retrieving the data.
    this.requests.getDistinctDeviceProduct().subscribe((response: any) => {
      this.ProductList = response;

      this.ProductFilteredOptions = this.editIntroForm.get('devicePor').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._productFilter(value))
      );

      const productControl = this.editIntroForm.get('devicePor');

      productControl.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.ProductList.find(option => option.devicePor === value);
        if (!matchingOption && value !== '') {
          productControl.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
    });
    this.editIntroForm = this.fb.group({

      intro_id: [this.request.intro_id, Validators.required],
      intro_date: [this.request.intro_date, Validators.required],
      intro_Emergency: [this.request.intro_Emergency, Validators.required],
      customersNum: [this.request.customersNum, Validators.required],
      intro_InOut: [this.request.intro_InOut, Validators.required],
      exhibitionID: [this.request.exhibitionID],
      ExhibitionIDNmAr: [this.request.exhibitionIDNmAr, Validators.required],
      deviceSR: [this.request.deviceSR],
      intro_damage: [this.request.intro_damage, Validators.required],
      intro_disc: [this.request.intro_disc, Validators.required],
      deviceType_ID: [this.request.typeId],
      deviceType_Name: [this.request.typeName],
      deviceModel_ID: [this.request.modelId],
      deviceModel_Name: [this.request.modelName],
      devicePro_ID: [this.request.productId],
      devicePor: [this.request.productName, Validators.required],
      intro_discT: [this.request.intro_discT],
      barcode: [this.request.barcode, Validators.required],
      datePurchase: [this.request.datePurchase, Validators.required],
      insert_By: [this.request.insert_By],
      status_Intro: [this.request.status_Intro, Validators.required],
      status_Intro_Name: [''],
      countDevice: [this.request.countDevice, Validators.required]
    });

  }


  onEmergencyStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus === 'صيانة طارئة') {
      this.editIntroForm.controls.intro_Emergency.setValue('صيانة طارئة');
    } else if (selectedStatus === 'غير طارئة') {
      this.editIntroForm.controls.intro_Emergency.setValue('غير طارئة');
    }
  }

  getTypeWhenPress() {
    const devicePro_ID = this.editIntroForm.get('devicePro_ID').value;

    if (!this.TypeList || this.TypeList.length === 0) {
      this.getDeviceType(devicePro_ID).subscribe((data) => {
        this.TypeList = data;
        this.TypeFilteredOptions = this.editIntroForm.get('deviceType_Name').valueChanges.pipe(
          startWith(''),
          map(value => this._typeFilter(value))
        );
        this.openTypeAutocompletePanel(); // Open the autocomplete panel
      });
    } else {
      this.TypeFilteredOptions = this.editIntroForm.get('deviceType_Name').valueChanges.pipe(
        startWith(''),
        map(value => this._typeFilter(value))
      );
      this.openTypeAutocompletePanel(); // Open the autocomplete panel
    }
  }

  openTypeAutocompletePanel() {
    setTimeout(() => {
      if (this.typeAuto) {
        this.typeAuto.openPanel();
      }
    }, 0);
  }

  getDeviceType(devicePro_ID: any): Observable<any> {
    return this.requests.getDistinctDeviceType(devicePro_ID);
  }

  getModelWhenPress() {
    const devicePro_ID = this.editIntroForm.get('devicePro_ID').value;
    const deviceType_ID = this.editIntroForm.get('deviceType_ID').value;

    if (!this.ModelList || this.ModelList.length === 0) {
      this.getDeviceModel(devicePro_ID, deviceType_ID).subscribe((data) => {
        this.ModelList = data;
        this.ModelFilteredOptions = this.editIntroForm.get('deviceModel_Name').valueChanges.pipe(
          startWith(''),
          map(value => this._modelFilter(value))
        );
        this.openModelAutocompletePanel(); // Open the autocomplete panel
      });
    } else {
      this.ModelFilteredOptions = this.editIntroForm.get('deviceModel_Name').valueChanges.pipe(
        startWith(''),
        map(value => this._modelFilter(value))
      );
      this.openModelAutocompletePanel(); // Open the autocomplete panel
    }
  }

  openModelAutocompletePanel() {
    setTimeout(() => {
      if (this.modelAuto) {
        this.modelAuto.openPanel();
      }
    }, 0);
  }

  getDeviceModel(devicePro_ID: any, deviceType_ID: any): Observable<any> {
    return this.requests.getDistinctDeviceModel(devicePro_ID, deviceType_ID);
  }

  // The Exhibition Filtering Method
  private _exhibitionFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.ExhibitionList.filter(option => option.exhibitionIDNmAr.toLowerCase().includes(filterValue));
  }
  // The Product Filtering Method
  private _productFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.ProductList.filter(option => option.productName.toLowerCase().includes(filterValue));
  }

  // The Type Filtering Method
  private _typeFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.TypeList.filter(option => option.deviceType_Name.toLowerCase().includes(filterValue));
  }

  // The Model Filtering Method
  private _modelFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.ModelList.filter(option => option.deviceModel_Name.toLowerCase().includes(filterValue));
  }

  //Setting the name and id of the Exhibition to the FormControl
  selectExhibition(option: any) {
    const selectedExhibition = option; // Assign the selected option name to the variable
    this.editIntroForm.get('exhibitionID').setValue(selectedExhibition.exhibitionID);
    this.editIntroForm.get('ExhibitionIDNmAr').setValue(selectedExhibition.exhibitionIDNmAr);
  }

  //Setting the name and id of the Product to the FormControl
  selectProduct(option: any) {
    const selectedProduct = option;
    this.editIntroForm.get('devicePro_ID').setValue(selectedProduct.productId);
    this.editIntroForm.get('devicePor').setValue(selectedProduct.productName);
  }


  // Setting the name and id of the Type to the FormControl
  selectType(option: any) {
    const selectedType = option;
    this.editIntroForm.get('deviceType_ID').setValue(selectedType.deviceType_ID);
    this.editIntroForm.get('deviceType_Name').setValue(selectedType.deviceType_Name);
  }

  // Setting the name and id of the Model to the FormControl
  selectModel(option: any) {
    const selectedType = option;
    this.editIntroForm.get('deviceModel_ID').setValue(selectedType.deviceModel_ID);
    this.editIntroForm.get('deviceModel_Name').setValue(selectedType.deviceModel_Name);
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Call your function only if it hasn't been called on "Enter" key press before
      if (!this.isEnterPressed && this.customersNum !== this.prevCustomerNum) {
        this.isEnterPressed = true;
        //Function goes here
        this.requests.GetCustomers_data(this.customersNum).subscribe((data) => {
          this.customerData = data;
          this.customerName = this.customerData.customers_FullName;
          this.customersAddress = this.customerData.customers_Address;

        });
        this.prevCustomerNum = this.customersNum;
      }
    }
  }

  handleBlur() {
    // Call your function only if it hasn't been called on "Enter" key press before
    if (!this.isEnterPressed && this.customersNum !== this.prevCustomerNum) {
      //Function goes here
      this.requests.GetCustomers_data(this.customersNum).subscribe((data) => {
        this.customerData = data;
        this.customerName = this.customerData.customers_FullName;
        this.customersAddress = this.customerData.customers_Address;
      });
      this.prevCustomerNum = this.customersNum;
    }
    // Reset the flag after the function call
    this.isEnterPressed = false;
  }
  editIntro() {
    this.requests.editIntro(this.editIntroForm.value).subscribe(() => {

    }, error => {
      if (error.status == 200) {
        this.toastr.success("تم تعديل الطلب الصيانه بنجاح")
        setTimeout(() => {
          const id = this.editIntroForm.value.intro_id;
          this.requests.LoadHistoryData(id);
          this.spinner.hide();
          this.router.navigate(['/user', id]);
        }, 3000);

      }
      else {
        this.toastr.error("لم يتم نعديل طلب الصيانة")
        this.spinner.hide();

      }

    });



  }



  onSubmit() {
    this.spinner.show();
    this.editIntro();
    setTimeout(() => {

      this.spinner.hide();
    }, 3000);
  }

  // Handle product selection change (specifically for Add New)
  onProductSelectionChange(event: any): void {
    if (event.source.selected && event.source.value === '__add_new__') {
      // Reset the selection to previous value or empty
      const currentVal = this.request.productName || '';
      // We don't want '__add_new__' to stay in the input
      setTimeout(() => {
        this.editIntroForm.get('devicePor').setValue(currentVal);
      }, 0);

      // Open the add device dialog
      const dialogRef = this.dialog.open(AddDeviceDECComponent, {
        width: '50%'
      });

      dialogRef.afterClosed().subscribe(result => {
        // Refresh product list
        this.requests.getDistinctDeviceProduct().subscribe((response: any) => {
          this.ProductList = response;
          // Trigger value changes to update the filtered list
          this.editIntroForm.get('devicePor').updateValueAndValidity({ emitEvent: true });
        });
      });
    }
  }

  // Load exhibitions list
  loadExhibitions(): void {
    this.requests.getExhibition().subscribe((response: any) => {
      this.ExhibitionList = response;
    });
  }

  // Handle exhibition selection change
  onExhibitionSelectionChange(event: any): void {
    if (event.value === '__add_new__') {
      // Reset the selection
      this.editIntroForm.get('ExhibitionIDNmAr').setValue(this.request.exhibitionIDNmAr);

      // Open the add exhibition dialog
      const dialogRef = this.dialog.open(AddOpposedComponent, {
        width: '40%'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Reload exhibitions list to show newly added exhibition
          this.loadExhibitions();
        }
      });
    } else {
      // Find the selected exhibition and set its ID
      const selectedExhibition = this.ExhibitionList.find(e => e.exhibitionIDNmAr === event.value);
      if (selectedExhibition) {
        this.editIntroForm.get('exhibitionID').setValue(selectedExhibition.exhibitionID);
      }
    }
  }

}
