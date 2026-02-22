import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsComponent } from 'app/bills/bills.component';
import { AuthService } from 'app/services/auth.service';
import { BillsService } from 'app/services/bills.service';
import { ItemService } from 'app/services/item.service';
import { ScheduledService } from 'app/services/scheduled.service';
import { WarehousesService } from 'app/services/warehouses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, startWith } from 'rxjs';

export class Warehouses {
  intro_id:number ;
  warehouseNo: number  ;
  piece_number: string   ;
  Desc_Piece: string   ;
  Price: string   ;
  disc: string   ;
  Count_pieces: string   ;
}

@Component({
  selector: 'app-maintenancemaintenance',
  templateUrl: './maintenancemaintenance.component.html',
  styleUrls: ['./maintenancemaintenance.component.scss']
})
export class MaintenancemaintenanceComponent implements OnInit {
  request:any;
editMaintenanceForm!: FormGroup;
warehouses: Warehouses[] = new Array<Warehouses>()
@ViewChild('MaintenanceDeleteDialog') MaintenanceDeleteDialog!: TemplateRef<any>;
@ViewChild('warehouseInput') productInput!: ElementRef<HTMLInputElement>;
@ViewChild('itemInput') typeInput!: ElementRef<HTMLInputElement>;

Status: any[] = [
  {'value': 1 , 'name': 'بحاجة الى قطع' },
  {'value': 2 , 'name': 'لاغي'},
 // {'value': 3 , 'name': 'تمت الصيانة'},
  {'value': 4 , 'name': 'لم تتم الصيانة'},
  {'value': 5 , 'name': 'موافقة العميل'},
  {'value': 6 , 'name': 'سحب الجهاز'},
 // {'value': 7 , 'name': 'منتهي'},
  {'value': 8 , 'name': 'اصدار ستد قبض'},


];
userID:number;
bills:any;
i :any;
index :number;
warehouseFilteredOptions: Observable<any[]>;
ItemFilteredOptions: Observable<any[]>;
warehouseNoList: any[];
itemListList: any[];
filteredOptionsWarehouseNo: Observable<any[]>;
myControl = new FormControl();
warehouseList: any[] = [];
ItemList: any[] = [];
@ViewChild(MatSort) sort!: MatSort;
itemAuto: MatAutocompleteTrigger;
modelAuto: MatAutocompleteTrigger;

 constructor(
  private http: HttpClient,
  private fb: FormBuilder,
  private activatedRoute: ActivatedRoute,
   private bill:BillsService,
   private item:ItemService,
   private Warehouses:WarehousesService,
   private scheduled:ScheduledService,
   private toster:ToastrService,
   private auth: AuthService,
   private dialog : MatDialog,
   private router: Router,
   private spinner:NgxSpinnerService,
   private titleService: Title) { }
  ngOnInit(): void {
    // to change the tab Title name .
    this.titleService.setTitle('الصيانة');
     this.userID = this.auth.getUserId();

    console.log(this.userID)
    //Product Code For Filtering And Retrieving the data.
    const someUserID = 1; // قيمة تمثل معرف المستخدم الخاص بك

    this.Warehouses.GetWarehouseNames().subscribe((response: any) => {
      this.warehouseList = response;



      this.warehouseFilteredOptions  = this.editMaintenanceForm.get('warehouseNo').valueChanges.pipe(
        startWith(''),
        map(value => {
          let name='';
          name = typeof value === 'string' ? value : value?.warehouseNameArabic;
          return name ?this._warehouseFilter(name, this.warehouseList): this.warehouseList.slice()})
      );
      const warehouseControl = this.editMaintenanceForm.get('warehouseNo');

      warehouseControl.valueChanges.pipe(
        debounceTime(300), // Adjust debounce time as needed
      ).subscribe(value => {
        const matchingOption = this.warehouseList.find(option => option.warehouseNameArabic === value);
        if (!matchingOption && value !== '') {
          warehouseControl.markAsTouched(); // Mark the control as touched to show any validation errors
        }
      });
      });



    this.activatedRoute.params.subscribe(params => {
         let id = params['id']
         this.bill.GetMaintenanceId(id).subscribe((res) => {
         this.bills = res;
         console.log(this.bills)
         let Start_Time: string = new Date().toLocaleTimeString();

         const a: Date = new Date();
         const d: number = a.getDate();
         const m: number = a.getMonth() + 1; // JavaScript months are 0-11
         const y: number = a.getFullYear();
         let start_date: string = `${m}/${d}/${y}`;
        this.editMaintenanceForm = this.fb.group({
          intro_id: [this.bills.intro_id, Validators.required],
          Request_statues: [this.bills.request_statues, Validators.required],
          DeviceSR: [this.bills.deviceSR1, Validators.required],
          Defects_detected: [this.bills.defects_detected, Validators.required],
          Desc_technical: [this.bills.desc_technical, Validators.required],
          start_Time: [Start_Time, ],
          start_date: [start_date, ],
          CustomersNum:[this.bills.customersNum],
          status: ['لم يتم تحويل الطلب', Validators.required],
          General_Desc: [this.bills.general_Desc, Validators.required],
          warehouseNo:new FormControl(''),
          warehouseNoName:new FormControl(''),
          maintenanceDate: [this.bills.customers_Address11],
          piece_number:[''],
          piece_numberName:[''],
          Desc_Piece:[''],
          Price:[''],
          disc:[''],
          Count_pieces:[''],



         })
      });

    }

    )

    this.warehouses.push(Object.assign({}));
    this.warehouses.push(Object.assign({}));
    this.warehouses.push(Object.assign({}));
    this.warehouses.push(Object.assign({}));
    this.warehouses.push(Object.assign({}));

  }

  displayWarehouseNo(warehouseNo: any): string {
    this.getWarehouseNo();

    return warehouseNo && warehouseNo.warehouseNameArabic ? warehouseNo.warehouseNameArabic : '';
  }




  displayPieceNumber(pieceNumber: any): string {
    let  warehouseNo= this.editMaintenanceForm.get('warehouseNo').value
    if(typeof warehouseNo === 'number' )
    {
      this.getItemWhenPress();
      if(pieceNumber ==null || pieceNumber== undefined)
      pieceNumber = this.itemListList;
      return pieceNumber && pieceNumber.itemName ? pieceNumber.itemName : ''&&   pieceNumber && pieceNumber.itemPiece ? pieceNumber.itemPiece : '';
      ;
  }
    return '';
  }


  getItemWhenPress() {
    const WarehouseNumber = this.editMaintenanceForm.get('warehouseNo').value;
    (this.item.GetItemNames(WarehouseNumber)).subscribe(result => {
      this.itemListList = result;
      this.ItemFilteredOptions = this.editMaintenanceForm.get('piece_number').valueChanges.pipe(
        startWith(''),
        map(value => {
          let name = '';
           name = typeof value === 'string' ? value : value?.itemName;

          return name ? this.filterItem(name as string, this.itemListList) : this.itemListList.slice();

        }),

      );
    });



  }
  getWarehouseNo() {
    const someUserID = 1; // قيمة تمثل معرف المستخدم الخاص بك
    (

      this.Warehouses.GetWarehouseNames()).subscribe(result => {
      this.warehouseNoList = result;
      this.filteredOptionsWarehouseNo = this.editMaintenanceForm.get('warehouseNo').valueChanges.pipe(
        startWith(''),
        map(value => {
          let name = '';
           name = typeof value === 'string' ? value : value?.warehouseNameArabic;

          return name ? this.filter(name as string, this.warehouseNoList) : this.warehouseNoList.slice();
        }),
      );
    });
  }


  private filter(name: string, objectFilter: any): any[] {
    const filterValue = name.toLowerCase();
      return objectFilter.filter((option: { warehouseNameArabic: string; }) => option.warehouseNameArabic.toLowerCase().includes(filterValue));

  }

  private filterItem(name: string, objectFilter: any): any[] {
    const filterValue = name.toLowerCase();
      return objectFilter.filter((option: { itemName: string; }) => option.itemName.toLowerCase().includes(filterValue));

  }

  onEmergencyStatusChange(event: any) {
    const selectedStatus = event.value;
    if (selectedStatus === 'بحاجة الى قطع') {
      this.editMaintenanceForm.controls.Request_statues.setValue(1);
    }
  else if (selectedStatus === 'لاغي') {
  this.editMaintenanceForm.controls.Request_statues.setValue(2);
  }
  //    else if (selectedStatus === 'تمت الصيانة') {
  //     this.editMaintenanceForm.controls.Request_statues.setValue(3);
  //   }
     else if (selectedStatus === 'لم تتم الصيانة') {
      this.editMaintenanceForm.controls.Request_statues.setValue(4);
    }
     else if (selectedStatus === 'موافقة العميل') {
      this.editMaintenanceForm.controls.Request_statues.setValue(5);
    }
     else if (selectedStatus === 'سحب الجهاز') {
      this.editMaintenanceForm.controls.Request_statues.setValue(6);
    }
    //  else if (selectedStatus === 'منتهي') {
    //   this.editMaintenanceForm.controls.Request_statues.setValue(7);
    // }
     else if (selectedStatus === 'اصدار سند قبض') {
      this.editMaintenanceForm.controls.Request_statues.setValue(8);
    }
  }

  SaveDateTime() {


    this.bill.SaveDateTime(this.editMaintenanceForm.value).subscribe(() => {

    }, error => {
      if(error.status==200)
      {
        this.toster.success("تم الحفظ")
        setTimeout(() => {
          this.spinner.hide();
        }, 3000);

      }
      else
      {
        this.toster.error("لم يتم الحفظ")
        this.spinner.hide();

      }

    });

  }


  openTypeAutocompletePanel() {
    setTimeout(() => {
      if (this.itemAuto) {
        this.itemAuto.openPanel();
      }
    }, 0);
  }
  GetItemNames(ItemNumber: any): Observable<any> {
    return this.item.GetItemNames(ItemNumber);
  }
   // The Product Filtering Method
   private _warehouseFilter(value: string, objectFillter:any): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return objectFillter.filter(option => option.warehouseNameArabic.toLowerCase().includes(filterValue));
  }

  // The Type Filtering Method
  private _itemFilter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.ItemList.filter(option => option.itemName.toLowerCase().includes(filterValue));
  }


 //Setting the name and id of the Product to the FormControl
 selectwarehouse(option: any) {
  this.editMaintenanceForm.get('warehouseNo').setValue(option.warehouseNumber);
}
 // Setting the name and id of the Type to the FormControl
 selectItem(option: any, index:number) {
  this.editMaintenanceForm.get('piece_number').setValue(option.itemNumber);



}




  EditSavemaintenance() {
    this.bill.editSavemaintenance(this.editMaintenanceForm.value).subscribe(() => {

    }, error => {
      if(error.status==200)
      {
        this.toster.success("تم تعديل البيانات")

        setTimeout(() => {
          this.spinner.hide();
          this.router.navigate(['/maintenanceTechnician']);

        }, 2000);


      }
      else
      {
        this.toster.error(" لم يتم تعديل البيانات ")
        this.spinner.hide();

      }

    });

  }


AddScheduled() {
console.log(this.editMaintenanceForm.value);


  this.scheduled.addNewScheduledMaintenance(this.editMaintenanceForm.value).subscribe(() => {

  }, error => {
    if(error.status==200)
    {
      this.toster.success("تم اضافة طلب صيانة دورية جديد بنجاح")
      this.spinner.hide();
    }
    else
    {
      this.toster.warning("لم تقم  بادخال موعد الصيانة الدورية");
      this.spinner.hide();

    }

  });

}
  onSubmit() {
    this.AddScheduled();

    this.spinner.show();

    this.warehouses.forEach((row) => {
      this.Add(row);
    });
    this.SaveDateTime();
    this.EditSavemaintenance();

    this.dataUpdated();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }
  dataUpdated() {
    this.bills.dataUpdated$.subscribe(() => {
    });
  }


  Add(row) {
     if (Object.keys(row).length === 0) {
    //  this.toster.warning("Empty row. Data not sent to the server.");
      return;
     }
    if (!row.warehouseNo || !row.piece_number || !row.Desc_Piece || !row.Price || !row.disc || !row.Count_pieces) {
      this.toster.warning("قم بادخال بيانات الصف كامل.");
      return;
    }
    const editMaintenance ={
        intro_id:this.bills.intro_id,
         warehouseNo: row.warehouseNo.warehouseNumber,
         piece_number: row.piece_number.itemNumber,
         Desc_Piece: row.Desc_Piece,
         disc: row.disc,
         Count_pieces: row.Count_pieces,
         Price: row.Price,
         model:null
    }


    this.bill.saveWarehouse(editMaintenance).subscribe(() => {

    }, error => {
      if(error.status==200)
      {

        this.toster.success("تم اضافة طلب جديد بنجاح")
        this.spinner.hide();
      }
      else
      {
        this.toster.error("لم يتم الاضافة ")
        this.spinner.hide();

      }

    });

  }

  openDeleteDialog(id: any) {
    const dialogRef = this.dialog.open(this.MaintenanceDeleteDialog);

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        if (res === 'yes') {
          this.bill.deleteMaintenance(id).subscribe(() => {


          }
          );
        } else {
        }
      }
    });
  }

}