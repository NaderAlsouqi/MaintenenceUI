import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { Console } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-add-maintenance-requests',
  templateUrl: './add-maintenance-requests.component.html',
  styleUrls: ['./add-maintenance-requests.component.scss']
})
export class AddmaintenancerequestsComponent implements OnInit {
  customerStatus: string[] = ['فعال', 'غير فعال'];
  MStatus: string[] = ['صيانة طارئة', 'غير طارئة'];
  MStatus2: string[] = ['داخلية', 'خارجية'];
  MStatus3: string[] = ['مشكوك', 'غير مكفول', 'مكفول'];
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

  isEnterPressed:boolean;

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
  addIntroForm!: FormGroup;

  userId: number;

  typeAuto: MatAutocompleteTrigger;
  modelAuto: MatAutocompleteTrigger;
  constructor(
    private fb: FormBuilder,
    public requests: MaintenanceRequestsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private dialog : MatDialog,
    private router: Router,



  ) {}

  @ViewChild('exhibitionInput') exhibitionInput!: ElementRef<HTMLInputElement>;
  @ViewChild('productInput') productInput!: ElementRef<HTMLInputElement>;
  @ViewChild('typeInput') typeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('AddcustomerDialog') AddcustomerDialog! :TemplateRef<any>;

  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('إدخال طلبات الصيانة');
    this.userId = this.authService.id;

    //Exhibition Code For Filtering And Retrieving the data.
    this.requests.getExhibition().subscribe((response: any) => {
      this.ExhibitionList = response;
  
      this.ExhibitionFilteredOptions = this.addIntroForm.get('ExhibitionIDNmAr').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._exhibitionFilter(value))
      );
  
      const exhibitionControl = this.addIntroForm.get('ExhibitionIDNmAr');
  
      exhibitionControl.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.ExhibitionList.find(option => option.exhibitionIDNmAr === value);
        if (!matchingOption && value !== '') {
          exhibitionControl.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
  
      this.exhibitionInput.nativeElement.addEventListener('focusout', () => {
        const value = exhibitionControl.value;
        const matchingOption = this.ExhibitionList.find(option => option.exhibitionIDNmAr === value);
        if (!matchingOption && value.trim() !== '') {
          exhibitionControl.setValue(''); // Clear the input field
          if (!this.ExhibitionList.some(option => option.exhibitionIDNmAr.includes(value))){
            this.toastr.warning('القيمة التي تم إدخالها لـ "اسم المعرض" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
          }
        }
      });
    });

    //Product Code For Filtering And Retrieving the data.
    this.requests.getDistinctDeviceProduct().subscribe((response: any) => {
    this.ProductList = response;

    this.ProductFilteredOptions = this.addIntroForm.get('devicePor').valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust debounce time as needed
      map(value => this._productFilter(value))
    );

    const productControl = this.addIntroForm.get('devicePor');

    productControl.valueChanges.pipe(
      debounceTime(300), // Adjust debounce time as needed
    ).subscribe(value => {
      const matchingOption = this.ProductList.find(option => option.devicePor === value);
      if (!matchingOption && value !== '') {
        productControl.markAsTouched(); // Mark the control as touched to show any validation errors
      }
    });
    });  
    
    //getting the currentDate & lastIntroID from the Maintenance page using the route params.
    this.route.queryParams.subscribe(params => {
      this.currentDate = new Date(params.currentDate);
      this.lastIntroID = params['lastIntroID'];
    });

    
     //getting the currentDate & lastIntroID from the Maintenance page using the route params.
     this.route.queryParams.subscribe(params => {
      this.currentDate = new Date(params.currentDate);
      this.lastIntroID = params['lastIntroID'];
    });

    // Initilizing the Form to add new Intro.
    this.addIntroForm = this.fb.group({
      intro_date: ['', ],
      intro_Emergency: ['غير طارئة', Validators.required],
      CustomersNum: ['', Validators.required],
      intro_InOut: ['خارجية', Validators.required],
      ExhibitionID: [null],
      ExhibitionIDNmAr: ['', Validators.required],
      DeviceSR: ['0'],
      intro_damage: ['', Validators.required],
      intro_disc: ['', Validators.required],
      deviceType_ID: [null],
      deviceType_Name: ['', Validators.required],
      deviceModel_ID: [null],
      deviceModel_Name: ['', Validators.required],
      devicePro_ID: [null],
      devicePor: ['', Validators.required],
      intro_discT: [''],
      barcode: ['', Validators.required],
      datePurchase: ['', Validators.required],
      insert_By: [this.userId],
      status_Intro: ['مشكوك', Validators.required],
      status_Intro_Name: [''],
      CountDevise: ['', Validators.required]
    });
  }

  onEmergencyStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus === 'صيانة طارئة') {
      this.addIntroForm.controls.intro_Emergency.setValue('صيانة طارئة');
    } else if (selectedStatus === 'غير طارئة') {
      this.addIntroForm.controls.intro_Emergency.setValue('غير طارئة');
    }
  }  

  getTypeWhenPress() {
    const devicePro_ID = this.addIntroForm.get('devicePro_ID').value;
  
    if (!this.TypeList || this.TypeList.length === 0) {
      this.getDeviceType(devicePro_ID).subscribe((data) => {
        this.TypeList = data;
        this.TypeFilteredOptions = this.addIntroForm.get('deviceType_Name').valueChanges.pipe(
          startWith(''),
          map(value => this._typeFilter(value))
        );
        this.openTypeAutocompletePanel(); // Open the autocomplete panel
      });
    } else {
      this.TypeFilteredOptions = this.addIntroForm.get('deviceType_Name').valueChanges.pipe(
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
    const devicePro_ID = this.addIntroForm.get('devicePro_ID').value;
    const deviceType_ID = this.addIntroForm.get('deviceType_ID').value;
  
    if (!this.ModelList || this.ModelList.length === 0) {
      this.getDeviceModel(devicePro_ID, deviceType_ID).subscribe((data) => {
        this.ModelList = data;
        this.ModelFilteredOptions = this.addIntroForm.get('deviceModel_Name').valueChanges.pipe(
          startWith(''),
          map(value => this._modelFilter(value))
        );
        this.openModelAutocompletePanel(); // Open the autocomplete panel
      });
    } else {
      this.ModelFilteredOptions = this.addIntroForm.get('deviceModel_Name').valueChanges.pipe(
        startWith(''),
        map(value => this._modelFilter(value))
      );
      this.openModelAutocompletePanel(); // Open the autocomplete panel
    }
  }

  openModelAutocompletePanel(){
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
    this.addIntroForm.get('ExhibitionID').setValue(selectedExhibition.exhibitionID);
    this.addIntroForm.get('ExhibitionIDNmAr').setValue(selectedExhibition.exhibitionIDNmAr);
  }

  //Setting the name and id of the Product to the FormControl
  selectProduct(option: any) {
    const selectedProduct = option;
    this.addIntroForm.get('devicePro_ID').setValue(selectedProduct.productId);
    this.addIntroForm.get('devicePor').setValue(selectedProduct.productName);
  }
  
  // Setting the name and id of the Type to the FormControl
  selectType(option: any) {
    const selectedType = option;
    this.addIntroForm.get('deviceType_ID').setValue(selectedType.deviceType_ID);
    this.addIntroForm.get('deviceType_Name').setValue(selectedType.deviceType_Name);
}

 // Setting the name and id of the Model to the FormControl
  selectModel(option: any) {
  const selectedType = option;
  this.addIntroForm.get('deviceModel_ID').setValue(selectedType.deviceModel_ID);
  this.addIntroForm.get('deviceModel_Name').setValue(selectedType.deviceModel_Name);
}


handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    // Call your function only if it hasn't been called on "Enter" key press before
    if (!this.isEnterPressed && this.customersNum !== this.prevCustomerNum) {
      this.isEnterPressed = true;
      //Function goes here
      this.requests.GetCustomers_data(this.customersNum).subscribe(
        (data) => {
          if (data) {
            this.customerData = data;
            this.customerName = this.customerData.customers_FullName;
            this.customersAddress = this.customerData.customers_Address;
            console.log('Data returned from the server:', data);
          } else {
            console.log('No content returned from the server.');
            this.toastr.warning('رقم العميل غير موجود الرجاء ادخال رقم العميل');
            this.dialog.open(this.AddcustomerDialog);

          }
        },
        (error) => {
          console.error('Error fetching data:', error);

        }
      );
      this.prevCustomerNum = this.customersNum;
    }
  }
}
// handleKeyPress(event: KeyboardEvent) {
//   if (event.key === 'Enter') {
//     // Call your function only if it hasn't been called on "Enter" key press before
//     if (!this.isEnterPressed && this.customersNum !== this.prevCustomerNum) {
//       this.isEnterPressed = true;
//       //Function goes here
//       this.requests.GetCustomers_data(this.customersNum).subscribe((data) => {
//         this.customerData = data;
//         this.customerName = this.customerData.customers_FullName;
//         this.customersAddress = this.customerData.customers_Address;
        
//       });
//       this.prevCustomerNum = this.customersNum;
//     }
//   }
// }

handleBlur() {
  // Call your function only if it hasn't been called on "Enter" key press before
  if (!this.isEnterPressed && this.customersNum !== this.prevCustomerNum) {
    //Function goes here
    this.requests.GetCustomers_data(this.customersNum).subscribe( (data) => {
      if (data) {
        this.customerData = data;
        this.customerName = this.customerData.customers_FullName;
        this.customersAddress = this.customerData.customers_Address;
        console.log('Data returned from the server:', data);
      } else {
        console.log('No content returned from the server.');
        this.toastr.warning('رقم العميل غير موجود الرجاء ادخال رقم العميل');
        this.dialog.open(this.AddcustomerDialog);

      }
    },
    (error) => {
      console.error('Error fetching data:', error);

    }
  );
    this.prevCustomerNum = this.customersNum;
  }
  // Reset the flag after the function call
  this.isEnterPressed = false;        
}

addIntro() {

  const formattedDate = this.currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const introDiscTValue = this.addIntroForm.get('intro_discT').value.trim() !== ''
  ? this.addIntroForm.get('intro_discT').value
  : '-----';

  this.addIntroForm.get('intro_date').setValue(formattedDate);
  this.addIntroForm.get('CustomersNum').setValue(this.customersNum);
  this.addIntroForm.get('intro_discT').setValue(introDiscTValue);
  this.requests.addIntro(this.addIntroForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toastr.success("تم اضافة طلب جديد بنجاح")
      setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/maintenance']);

      }, 2000);
      this.spinner.hide();
    }
    else
    {
      this.toastr.error("لم يتم اضافة الطلب ")
      this.spinner.hide();

    }
    
  });

}
  
submit() {
    // Handle form submission
    this.addIntro();


}
}