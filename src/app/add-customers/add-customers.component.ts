import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import validation from 'ajv/dist/vocabularies/validation';
import { CustomersService } from 'app/services/customers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { AreaService } from 'app/services/area.service';
import { AddAreaComponent } from 'app/add-area/add-area.component';
import * as L from 'leaflet';



@Component({
  selector: 'app-add-customers',
  templateUrl: './add-customers.component.html',
  styleUrls: ['./add-customers.component.scss']
})
export class AddCustomersComponent implements OnInit, AfterViewInit, OnDestroy {

  customerStatus: any[] = [{ 'value': 1, 'name': 'فعال' },
  { 'value': 2, 'name': 'غير فعال' },
  ];
  areaList: string[] = [" "];
  cityList: string[] = [
    "عمان", "الزرقاء", "اربد", "عجلون", "جرش", "معان",
    "الكرك", "العقبة", "الطفيلة", "البلقاء", "مادبا", "المفرق"
  ]
  AddressList: any[] = [];
  allCustomers: any[] = [];

  myControl = new FormControl();
  AddressFilteredOptions: Observable<any[]>;

  addressAuto: MatAutocompleteTrigger;

  addCustomerForm!: FormGroup;
  Customers_Status = 1;
  Status = { value: 1, name: 'فعال' };

  // Map properties
  private map: L.Map;
  private marker: L.Marker;
  showMap = false;

  constructor(private fb: FormBuilder, private customer: CustomersService,
    private _area: AreaService,
    private toster: ToastrService, private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCustomersComponent>) { }

  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  @ViewChild('longitudeInput') longitudeInput!: ElementRef;

  ngOnInit(): void {


    this.addCustomerForm = this.fb.group({
      CustomersNum: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      Customers_FName: ['', Validators.required],
      Customers_LName: ['',],
      Customers_PName: ['',],
      Customers_FaName: [''],
      Customers_phone1: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      Customers_phone2: ['', Validators.pattern('^[0-9]*$')],
      Customers_Address: ['',],
      Customers_email: ['', Validators.email],
      Customers_Status: [this.Status],
      Customers_bank: [''],
      Customers_ACC: [0],
      Customers_Pic: [''],
      Customers_Address1: [''],
      Customers_Address2: ['', Validators.required],
      Customers_AddressName: ['', Validators.required],
      LocationLatitude: [''],
      LocationLongitude: ['']
    });

    // Load areas for dropdown
    this.loadAreas();

    this.customer.getAlluser().subscribe((res: any) => {
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
      // Reset the selection
      this.addCustomerForm.get('Customers_Address2').setValue('');

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


  ngAfterViewInit(): void {
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
    const currentLat = this.addCustomerForm.get('LocationLatitude').value;
    const currentLng = this.addCustomerForm.get('LocationLongitude').value;
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

    this.map = L.map('add-customer-map', {
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
      this.addCustomerForm.controls['LocationLatitude'].setValue(e.latlng.lat);
      this.addCustomerForm.controls['LocationLongitude'].setValue(e.latlng.lng);

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

        this.addCustomerForm.controls['LocationLatitude'].setValue(lat);
        this.addCustomerForm.controls['LocationLongitude'].setValue(lng);
        this.toster.info("تم تحديد الموقع بنجاح");
        this.spinner.hide();

        if (this.showMap) {
          if (this.map) {
            this.updateMapMarker(lat, lng);
          } else {
            // Map visible but not init? rare but possible if timeout pending
          }
        } else {
          // Auto open map
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
    this.customer.searchLocation(query).subscribe((results: any[]) => {
      this.spinner.hide();
      if (results && results.length > 0) {
        const first = results[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);

        this.addCustomerForm.controls['LocationLatitude'].setValue(lat);
        this.addCustomerForm.controls['LocationLongitude'].setValue(lng);

        if (!this.showMap) {
          this.showMap = true;
          setTimeout(() => this.initMap(), 150);
        } else {
          this.updateMapMarker(lat, lng);
        }

        this.toster.success("تم العثور على الموقع");
      } else {
        this.toster.warning("لم يتم العثور على نتائج للموقع المدخل");
      }
    }, err => {
      this.spinner.hide();
      console.error(err);
      this.toster.error("حدث خطأ أثناء البحث عن الموقع");
    });
  }



  onEmergencyStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus === 'فعال') {
      this.addCustomerForm.controls.Customers_Status.setValue(1);
    } else if (selectedStatus === 'غير فعال') {
      this.addCustomerForm.controls.Customers_Status.setValue(2);
    }
  }


  // The Exhibition Filtering Method
  private _addressFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.AddressList.filter(option => option.cityNameAr.toLowerCase().includes(filterValue));
  }
  selectProduct(city: any) {
    this.addCustomerForm.get('Customers_AddressName').setValue(city);
  }
  // Setting the name and id of the Type to the FormControl
  selectType(option: any) {
    const selectedType = option;
    this.addCustomerForm.get('Customers_Address2').setValue(selectedType.cityNameAr);
    this.addCustomerForm.get('Customers_Address').setValue(selectedType.CityID);

  }
  AddCustomer() {
    this.customer.addCustomer(this.addCustomerForm.value).subscribe(
      (response) => {
        // Success callback
        this.toster.success("تم اضافة العميل بنجاح");
        this.spinner.hide();
        this.dialogRef.close(true); // Close dialog and indicate success
      },
      (error) => {
        // Error callback
        if (error.status == 200) {
          // Sometimes the API returns 200 but it's parsed as an error due to response format
          this.toster.success("تم اضافة العميل بنجاح");
          this.spinner.hide();
          this.dialogRef.close(true);
        } else {
          this.toster.error("لم يتم اضافة العميل");
          this.spinner.hide();
        }
      }
    );
  }
  onClose() {

    this.dialogRef.close();
  }

  onLatitudeInput() {
    const latitudeValue = this.addCustomerForm.get('LocationLatitude').value;

    if (latitudeValue && latitudeValue.length === 17) {
      this.longitudeInput.nativeElement.focus();
    }

  }


  getAddressNameWhenPress() {
    const address = this.addCustomerForm.get('Customers_AddressName').value;

    if (!this.AddressList || this.AddressList.length === 0) {
      this.customer.GetFaultsLocation(address).subscribe((response: any) => {
        this.AddressList = response;

        this.AddressFilteredOptions = this.addCustomerForm.get('Customers_Address2').valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => this._addressFilter(value))
        );

        const addressControl = this.addCustomerForm.get('Customers_Address2');

        addressControl.valueChanges.pipe(
          debounceTime(300)
        ).subscribe(value => {
          const matchingOption = this.AddressList.find(option => option.cityNameAr === value);
          if (!matchingOption && value !== '') {
            addressControl.markAsTouched();
          }
        });

        this.addressInput.nativeElement.addEventListener('focusout', () => {
          const value = addressControl.value;
          const matchingOption = this.AddressList.find(option => option.cityNameAr === value);
          if (!matchingOption && value.trim() !== '') {
            addressControl.setValue('');
            if (!this.AddressList.some(option => option.cityNameAr.includes(value))) {
              this.toster.warning('القيمة التي تم إدخالها لـ "اسم المنطقة" لا تتطابق مع أي من الخيارات المتاحة.', 'تحذير', { timeOut: 5000 });
            }
          }
        });

        // Update the AddressFilteredOptions with the filtered values
        this.AddressFilteredOptions = this.addCustomerForm.get('Customers_Address2').valueChanges.pipe(
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

  onSubmit() {
    const customersNum = this.addCustomerForm.get('CustomersNum').value;
    if (customersNum) {
      const exists = this.allCustomers.some(c => c.customersNum == customersNum);
      if (exists) {
        this.toster.error('رقم العميل موجود مسبقاً');
        return;
      }
    }

    const customersPhone = this.addCustomerForm.get('Customers_phone1').value;
    if (customersPhone) {
      const phoneExists = this.allCustomers.some(c => c.customers_phone1 == customersPhone);
      if (phoneExists) {
        this.toster.error('رقم الهاتف موجود مسبقاً');
        return;
      }
    }

    this.spinner.show();
    this.AddCustomer();

    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

  }
}