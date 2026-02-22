import { Component, ElementRef, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from 'app/services/customers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { AreaService } from 'app/services/area.service';
import { AddAreaComponent } from 'app/add-area/add-area.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-edit-customers',
  templateUrl: './edit-customers.component.html',
  styleUrls: ['./edit-customers.component.scss']
})
export class EditCustomersComponent implements OnInit, OnDestroy {

  areaList: string[] = [" "];
  cityList: string[] = [
    "عمان", "الزرقاء", "اربد", "عجلون", "جرش ", "معان",
    "الكرك", "العقبة", "الطفيلة", "البلقاء", "مادبا ", "المفرق"
  ]
  customerStatus: any[] = [{ 'value': 1, 'name': 'فعال' },
  { 'value': 2, 'name': 'غير فعال' },
  ];

  AddressList: any[] = [];
  allCustomers: any[] = [];

  myControl = new FormControl();
  AddressFilteredOptions: Observable<any[]>;

  addressAuto: MatAutocompleteTrigger;

  Customers_Status = 1;
  Status = { value: 1, name: 'فعال' };

  editCustomerForm!: FormGroup;

  // Map properties
  private map: L.Map;
  private marker: L.Marker;
  showMap = false;


  constructor(
    private fb: FormBuilder,
    private _customer: CustomersService,
    private _area: AreaService,
    private toster: ToastrService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditCustomersComponent>,
    @Inject(MAT_DIALOG_DATA) public customer: any
  ) { }
  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  @ViewChild('longitudeInput') longitudeInput!: ElementRef;


  ngOnInit(): void {
    // Sanitize data
    if (this.customer.customers_phone2 === 'غير متوفر') {
      this.customer.customers_phone2 = '';
    }

    this.editCustomerForm = this.fb.group({
      CustomersID: [this.customer.customersID, Validators.required],
      CustomersNum: [{ value: this.customer.customersNum, disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]],
      Customers_FName: [this.customer.customers_FName, Validators.required],
      Customers_LName: [this.customer.customers_LName],
      Customers_PName: [this.customer.customers_PName],
      Customers_FaName: [this.customer.customers_FaName],
      Customers_phone1: [this.customer.customers_phone1, [Validators.required, Validators.pattern('^[0-9]*$')]],
      Customers_phone2: [this.customer.customers_phone2, Validators.pattern('^[0-9]*$')],
      Customers_AddressName: [this.customer.customers_AddressName, Validators.required],
      Customers_email: [this.customer.customers_email, [Validators.email]],
      Customers_Status: [this.customer.customers_Status],
      Customers_bank: [this.customer.customers_bank],
      Customers_ACC: [this.customer.customers_ACC],
      Customers_Pic: [this.customer.customers_Pic],
      Customers_Address1: [this.customer.customers_Address1],
      Customers_Address2: [this.customer.customers_Address2, Validators.required],
      Customers_Address: [this.customer.customers_Address],
      LocationLatitude: [this.customer.locationLatitude],
      LocationLongitude: [this.customer.locationLongitude]
    });

    // Load areas for dropdown
    this.loadAreas();

    this._customer.getAlluser().subscribe((res: any) => {
      this.allCustomers = res;
    });

  }

  loadAreas(): void {
    this._area.getAllarae().subscribe((areas: any[]) => {
      this.areaList = areas.map(a => a.cityNameAr);
    });
  }

  // Handle area selection change
  onAreaSelectionChange(event: any): void {
    if (event.value === '__add_new__') {
      // Reset the selection to previous value or empty
      const currentValue = this.customer.customers_Address2 || '';
      this.editCustomerForm.get('Customers_Address2').setValue(currentValue);

      // Open add area dialog
      const dialogRef = this.dialog.open(AddAreaComponent, {
        width: '600px',
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Reload areas after adding new one
          this.loadAreas();
          this.toster.success('تم إضافة المنطقة بنجاح، يمكنك اختيارها الآن');
        }
      });
    }
  }
  getAddressNameWhenPress() {
    const address = this.editCustomerForm.get('Customers_AddressName').value;

    if (!this.AddressList || this.AddressList.length === 0) {
      this._customer.GetFaultsLocation(address).subscribe((response: any) => {
        this.AddressList = response;

        this.AddressFilteredOptions = this.editCustomerForm.get('Customers_Address2').valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => this._addressFilter(value))
        );

        const addressControl = this.editCustomerForm.get('Customers_Address2');

        addressControl.valueChanges.pipe(
          debounceTime(300)
        ).subscribe(value => {
          const matchingOption = this.AddressList.find(option => option.faultsNmAr === value);
          if (!matchingOption && value !== '') {
            addressControl.markAsTouched();
          }
        });

        this.addressInput.nativeElement.addEventListener('focusout', () => {
          const value = addressControl.value;
          const matchingOption = this.AddressList.find(option => option.faultsNmAr === value);
          if (!matchingOption && value.trim() !== '') {
            addressControl.setValue('');
            if (!this.AddressList.some(option => option.faultsNmAr.includes(value))) {
              this.toster.warning('القيمة التي تم إدخالها لـ "اسم المنطقة" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
            }
          }
        });

        // Update the AddressFilteredOptions with the filtered values
        this.AddressFilteredOptions = this.editCustomerForm.get('Customers_Address2').valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => this._addressFilter(value))
        );

      });
      this.openAddressAutocompletePanel(); // Open the autocomplete panel
    }
  }


  openAddressAutocompletePanel() {
    setTimeout(() => {
      if (this.addressAuto) {
        this.addressAuto.openPanel();
      }
    }, 0);
  }

  onEmergencyStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus === 'فعال') {
      this.editCustomerForm.controls.Customers_Status.setValue('فعال');
    } else if (selectedStatus === 'غير فعال') {
      this.editCustomerForm.controls.Customers_Status.setValue('غير فعال');
    }
  }

  // The Exhibition Filtering Method
  private _addressFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.AddressList.filter(option => option.faultsNmAr.toLowerCase().includes(filterValue));
  }
  selectProduct(city: any) {
    this.editCustomerForm.get('Customers_AddressName').setValue(city);
  }
  // Setting the name and id of the Type to the FormControl
  selectType(option: any) {
    const selectedType = option;
    this.editCustomerForm.get('Customers_Address2').setValue(selectedType.faultsNmAr);
    this.editCustomerForm.get('Customers_Address').setValue(selectedType.faultsID);

  }

  onLatitudeInput() {
    const latitudeValue = this.editCustomerForm.get('LocationLatitude').value;

    if (latitudeValue && latitudeValue.length === 17) {
      this.longitudeInput.nativeElement.focus();
    }

  }
  EditCustomer() {
    this._customer.editCustomer(this.editCustomerForm.value).subscribe(
      (response) => {
        // Success callback
        this.toster.success("تم تعديل معلومات العميل");
        this.spinner.hide();
        // Close modal after 1 second
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      (error) => {
        // Error callback
        if (error.status == 200) {
          // Sometimes the API returns 200 but it's parsed as an error due to response format
          this.toster.success("تم تعديل معلومات العميل");
          this.spinner.hide();
          // Close modal after 1 second
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000);
        } else {
          this.toster.error("لم يتم تعديل معلومات العميل");
          this.spinner.hide();
        }
      }
    );
  }

  onClose() {

    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    if (this.showMap) {
      setTimeout(() => this.initMap(), 150);
    } else {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
    }
  }

  private initMap(): void {
    const currentLat = this.editCustomerForm.get('LocationLatitude').value;
    const currentLng = this.editCustomerForm.get('LocationLongitude').value;
    const lat = currentLat || 31.9539;
    const lng = currentLng || 35.9106;
    const zoom = currentLat ? 15 : 10;

    // Fix leaflet default icon path
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });

    this.map = L.map('edit-customer-map', {
      center: [lat, lng],
      zoom: zoom
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    if (currentLat && currentLng) {
      this.marker = L.marker([currentLat, currentLng]).addTo(this.map);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.editCustomerForm.controls['LocationLatitude'].setValue(e.latlng.lat);
      this.editCustomerForm.controls['LocationLongitude'].setValue(e.latlng.lng);

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
      this.toster.info('تم تحديد الموقع بنجاح');
    });
  }

  searchControl = new FormControl('');

  getUserLocation() {
    if (navigator.geolocation) {
      this.spinner.show();
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.editCustomerForm.controls['LocationLatitude'].setValue(lat);
        this.editCustomerForm.controls['LocationLongitude'].setValue(lng);
        this.toster.info("تم تحديد الموقع بنجاح");
        this.spinner.hide();

        if (this.showMap) {
          this.updateMapMarker(lat, lng);
        } else {
          this.showMap = true;
          setTimeout(() => this.initMap(), 150);
        }
      }, (error) => {
        this.spinner.hide();
        console.error('Error occurred: ' + error.message);
        this.toster.error("فشل تحديد الموقع. يرجى السماح للموقع أو التحقق من الاتصال.");
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    } else {
      this.toster.error('Geolocation is not supported by this browser.');
    }
  }

  updateMapMarker(lat: number, lng: number) {
    if (this.map) {
      this.map.setView([lat, lng], 16);
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }
    }
  }

  searchAddress() {
    const query = this.searchControl.value;
    if (!query) {
      this.toster.warning("يرجى إدخال اسم موقع للبحث عنه");
      return;
    }

    this.spinner.show();
    this._customer.searchLocation(query).subscribe((results: any[]) => {
      this.spinner.hide();
      if (results && results.length > 0) {
        const first = results[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);

        this.editCustomerForm.controls['LocationLatitude'].setValue(lat);
        this.editCustomerForm.controls['LocationLongitude'].setValue(lng);

        if (!this.showMap) {
          this.showMap = true;
          setTimeout(() => this.initMap(), 150);
        } else {
          this.updateMapMarker(lat, lng);
        }

        this.toster.success("تم العثور على الموقع");
      } else {
        this.toster.warning("لم يتم العثور على نتائج");
      }
    }, err => {
      this.spinner.hide();
      this.toster.error("حدث خطأ أثناء البحث");
    });
  }

  onSubmit() {
    const customersNum = this.editCustomerForm.get('CustomersNum').value;
    const currentId = this.customer.customersID;

    if (customersNum) {
      const exists = this.allCustomers.some(c => c.customersNum == customersNum && c.customersID !== currentId);
      if (exists) {
        this.toster.error('رقم العميل موجود مسبقاً');
        return;
      }
    }

    const customersPhone = this.editCustomerForm.get('Customers_phone1').value;
    if (customersPhone) {
      const phoneExists = this.allCustomers.some(c => c.customers_phone1 == customersPhone && c.customersID !== currentId);
      if (phoneExists) {
        this.toster.error('رقم الهاتف موجود مسبقاً');
        return;
      }
    }

    this.spinner.show();
    this.EditCustomer();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

  }
}