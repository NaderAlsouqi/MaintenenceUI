import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Title } from '@angular/platform-browser';
import { MaintenanceRequestsService } from 'app/services/maintenance-requests.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-define-devices',
  templateUrl: './define-devices.component.html',
  styleUrls: ['./define-devices.component.scss']
})
export class DefineDevicesComponent implements OnInit {
  ProductFilteredOptions: Observable<any[]>;
  ProductFilteredOptions1: Observable<any[]>;
  ProductList: any[] = [];
  ProductList1: any[] = [];
  myControl = new FormControl();

  options: string[] = ['ثلاجة', 'غاز','غسالة '];
  filteredOptions: Observable<string[]>;
  TypeFilteredOptions: Observable<any[]>;
  TypeList: any[] = [];

  typeAuto: MatAutocompleteTrigger;
  modelAuto: MatAutocompleteTrigger;
  isControlEnabled: boolean[] = [true, false, false];
  defineForm!: FormGroup;
  @ViewChild('productInput') productInput!: ElementRef<HTMLInputElement>;
  @ViewChild('typeInput') typeInput!: ElementRef<HTMLInputElement>;

  constructor(
    public requests: MaintenanceRequestsService,
    private fb: FormBuilder,
    private toster: ToastrService,
    private spinner: NgxSpinnerService,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private titleService: Title
  ) {

  }


  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('تعريف الأجهزة');

    //Product Code For Filtering And Retrieving the data.
    this.requests.getDistinctDeviceProduct().subscribe((response: any) => {
      this.ProductList = response;
      this.cdRef.detectChanges(); // يقوم بتحديث واجهة المستخدم


      this.ProductFilteredOptions = this.defineForm.get('devicePor').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._productFilter1(value))
      );

      const productControl = this.defineForm.get('devicePor');

      productControl.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.ProductList.find(option => option.devicePor === value);
        if (!matchingOption && value !== '') {
          productControl.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
      });


       //Product Code For Filtering And Retrieving the data.
    this.requests.getDistinctDeviceProduct().subscribe((response: any) => {
      this.ProductList1 = response;
      this.cdRef.detectChanges(); // يقوم بتحديث واجهة المستخدم

      this.ProductFilteredOptions1 = this.defineForm.get('devicePor1').valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Adjust debounce time as needed
        map(value => this._productFilter1(value))
      );

      const productControl1 = this.defineForm.get('devicePor1');

      productControl1.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption1 = this.ProductList1.find(option => option.devicePor === value);
        if (!matchingOption1 && value !== '') {
          productControl1.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
      });

      this.defineForm = this.fb.group({

        product: [''],
        devicePor: [''],
        devicePor1: [''],
        deviceType_Name: [''],
        deviceType_Name1: [''],
        devicePro_ID: [''],
        devicePro_ID1: [''],
        deviceModel_Name: [''],
        deviceType_ID: [''],
id:[null]

      });
    }

    getTypeWhenPress() {
      const devicePro_ID = this.defineForm.get('devicePro_ID').value;

      if (!this.TypeList || this.TypeList.length === 0) {
        this.getDeviceType(devicePro_ID).subscribe((data) => {
          this.TypeList = data;
          this.TypeFilteredOptions = this.defineForm.get('deviceType_Name').valueChanges.pipe(
            startWith(''),
            map(value => this._typeFilter(value))
          );
          this.openTypeAutocompletePanel(); // Open the autocomplete panel
        });
      } else {
        this.TypeFilteredOptions = this.defineForm.get('deviceType_Name').valueChanges.pipe(
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
// The Product Filtering Method
private _productFilter(value: string): any[] {
  const filterValue = value ? value.toLowerCase() : '';
  return this.ProductList.filter(option => option.productName.toLowerCase().includes(filterValue));
}
// The Product Filtering Method
private _productFilter1(value: string): any[] {
  const filterValue = value ? value.toLowerCase() : '';
  return this.ProductList1.filter(option => option.productName.toLowerCase().includes(filterValue));
}

// The Type Filtering Method
  private _typeFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.TypeList.filter(option => option.deviceType_Name.toLowerCase().includes(filterValue));
  }

 //Setting the name and id of the Product to the FormControl
 selectProduct(option: any) {
  const selectedProduct = option;
  this.defineForm.get('devicePro_ID').setValue(selectedProduct.productId);
  this.defineForm.get('devicePor').setValue(selectedProduct.productName);
}

 // Setting the name and id of the Type to the FormControl
 selectType(option: any) {
  const selectedType = option;
  this.defineForm.get('deviceType_ID').setValue(selectedType.deviceType_ID);
  this.defineForm.get('deviceType_Name').setValue(selectedType.deviceType_Name);
}
selectProductFromList(product: any) {
  this.defineForm.get('devicePro_ID').setValue(product.productId);
}
selectProductFromList1(product: any) {
  this.defineForm.get('devicePro_ID1').setValue(product.productId);
}

selectTypeFromList(product: any) {
  this.defineForm.get('deviceType_ID').setValue(product.deviceType_ID);
}

AddDevicePor() {
 const productValue = this.defineForm.get('product').value;

  if (!productValue || productValue.trim() === '') {
   // this.toster.warning("Product value is empty or null, skipping server request.");
    return; // Return early if the input is empty or null
  }

  this.spinner.show();

  // Rest of your existing code for adding the device
  this.requests.addDevicePor(this.defineForm.value).subscribe(() => { }, error => {
    if (error.status == 200) {
      this.getUpdatedDeviceProductList();
      this.toster.success("تم اضافة المنتج بنجاح");
      this.spinner.hide();
    } else {
      this.toster.error("لم يتم اضافه المنتج ");
      this.spinner.hide();
    }


  });

}



getUpdatedDeviceProductList() {
  this.requests.getDistinctDeviceProduct().subscribe((response: any) => {
    this.ProductList1 = response;
    this.cdRef.detectChanges(); // يقوم بتحديث واجهة المستخدم
  });
}
saveproduct(){
  this.AddDevicePor();
  setTimeout(() => {

    this.spinner.hide();
  }, 5000);

}








AddDevicePorType() {
  const productTypeValue = this.defineForm.get('deviceType_Name1').value;
  const productValue = this.defineForm.get('devicePor1').value;
  const productTypeIdValue = this.defineForm.get('devicePro_ID').value;
  console.log('$$$$$$$$$$$$$$$$')
  console.log('productTypeValue')

  console.log(productTypeValue)
  console.log('productValue')

  console.log(productValue)
  console.log('productTypeIdValue')

  console.log(productTypeIdValue)
  console.log('$$$$$$$$$$$$$$$$')

   if (!productTypeValue || productTypeValue.trim() === ''||!productValue || productValue.trim() === ''||!productTypeIdValue || productTypeIdValue.trim() === '') {
   // this.toster.warning("الرجاء ادخال قيمه .");
     return; // Return early if the input is empty or null
   }

   this.spinner.show();

   // Rest of your existing code for adding the device
   this.requests.addDeviceType(this.defineForm.value).subscribe(() => { }, error => {
     if (error.status == 200) {
      this.toster.success("تم اضافه نوع المنتج");
       this.spinner.hide();
     } else {
       this.toster.error("لم يتم اضافه نوع المنتج");
       this.spinner.hide();
     }


   });

 }




 saveproductType(){

  this.CheckDeviceDECType();
   setTimeout(() => {

     this.spinner.hide();
   }, 5000);

 }
 
 EditNewdeviceType()
 {
  const productTypeValue = this.defineForm.get('deviceType_Name1').value;
  const productValue = this.defineForm.get('devicePor1').value;
  const productTypeIdValue = this.defineForm.get('devicePro_ID').value;
  console.log('$$$$$$$$$$$$$$$$')
  console.log('productTypeValue')

  console.log(productTypeValue)
  console.log('productValue')

  console.log(productValue)
  console.log('productTypeIdValue')

  console.log(productTypeIdValue)
  console.log('$$$$$$$$$$$$$$$$')

   if (!productTypeValue || productTypeValue.trim() === ''||!productValue || productValue.trim() === ''||!productTypeIdValue || productTypeIdValue.trim() === '') {
   // this.toster.warning("الرجاء ادخال قيمه .");
     return; // Return early if the input is empty or null
   }

   this.spinner.show();

   // Rest of your existing code for adding the device
   this.requests.EditNewdeviceType(this.defineForm.value).subscribe(() => { }, error => {
     if (error.status == 200) {
      this.toster.success("تم اضافه نوع المنتج");
       this.spinner.hide();
     } else {
       this.toster.error("لم يتم اضافه نوع المنتج");
       this.spinner.hide();
     }


   });

 }
 EditNewdeviceModel()
 { const productTypeValue = this.defineForm.get('deviceType_Name').value;
 const productValue = this.defineForm.get('devicePor').value;
 const productTypeIdValue = this.defineForm.get('devicePro_ID1').value;
 const modelNameValue = this.defineForm.get('deviceModel_Name').value;
 const TypeIdValue = this.defineForm.get('deviceType_ID').value;

  if (!productTypeValue || productTypeValue.trim() === ''||!productValue || productValue.trim() === ''||!productTypeIdValue || productTypeIdValue.trim() === ''||!TypeIdValue || TypeIdValue.trim() === ''||!modelNameValue || modelNameValue.trim() === '') {
  // this.toster.warning("الرجاء ادخال قيمه ");
     return; // Return early if the input is empty or null
  }

  this.spinner.show();
  
  // Rest of your existing code for adding the device
  this.requests.EditNewdeviceModel(this.defineForm.value).subscribe(() => { }, error => {
    if (error.status == 200) {
     this.toster.success("تم اضافة موديل المنتج ");
      this.spinner.hide();
    } else {
      this.toster.error("لم يتم اضافة موديل المنتج");
      this.spinner.hide();
    }


  });}
AddDeviceModel() {
  const productTypeValue = this.defineForm.get('deviceType_Name').value;
  const productValue = this.defineForm.get('devicePor').value;
  const productTypeIdValue = this.defineForm.get('devicePro_ID1').value;
  const modelNameValue = this.defineForm.get('deviceModel_Name').value;
  const TypeIdValue = this.defineForm.get('deviceType_ID').value;

   if (!productTypeValue || productTypeValue.trim() === ''||!productValue || productValue.trim() === ''||!productTypeIdValue || productTypeIdValue.trim() === ''||!TypeIdValue || TypeIdValue.trim() === ''||!modelNameValue || modelNameValue.trim() === '') {
   // this.toster.warning("الرجاء ادخال قيمه ");
      return; // Return early if the input is empty or null
   }

   this.spinner.show();
   
   // Rest of your existing code for adding the device
   this.requests.addNewdeviceModel(this.defineForm.value).subscribe(() => { }, error => {
     if (error.status == 200) {
      this.toster.success("تم اضافة موديل المنتج ");
       this.spinner.hide();
     } else {
       this.toster.error("لم يتم اضافة موديل المنتج");
       this.spinner.hide();
     }


   });

 }

 CheckDeviceDECModel_ID() {
  this.requests.CheckDeviceDECModel_ID().subscribe((data) => {
    const dataTypepro=data;
   console.log(dataTypepro && dataTypepro.length > 0) 
    if (dataTypepro && dataTypepro.length > 0){
      this.defineForm.get('id').setValue(dataTypepro[0].id);
      this.EditNewdeviceModel();
  }else 
   {  
this.AddDeviceModel();
   }
  });
}

CheckDeviceDECType() {
  this.requests.CheckDeviceDECType().subscribe((data) => {
    const dataTypepro=data;
   console.log(dataTypepro && dataTypepro.length > 0) 
    if (dataTypepro && dataTypepro.length > 0){
      this.defineForm.get('id').setValue(dataTypepro[0].id);
      this.EditNewdeviceType();
  }else 
   {  
this.AddDevicePorType();
   }
  });
}
 saveproductModel(){

   this.CheckDeviceDECModel_ID();
   setTimeout(() => {

     this.spinner.hide();
   }, 5000);

 }

enableNext(index: number) {
    if (index < this.isControlEnabled.length - 1) {
      this.isControlEnabled[index + 1] = true;
    }
  }





}

