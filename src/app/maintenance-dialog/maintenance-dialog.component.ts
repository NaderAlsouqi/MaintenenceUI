import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/services/auth.service';
import { BillsService } from 'app/services/bills.service';
import { ItemService } from 'app/services/item.service';
import { WarehousesService } from 'app/services/warehouses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MaintenanceItemService } from 'app/services/maintenance-item.service';

@Component({
    selector: 'app-maintenance-dialog',
    templateUrl: './maintenance-dialog.component.html',
    styleUrls: ['./maintenance-dialog.component.scss']
})
export class MaintenanceDialogComponent implements OnInit {
    editMaintenanceForm!: FormGroup;

    // Status options available for technician
    Status: any[] = [
        { 'value': 1, 'name': 'بحاجة الى قطع' },
        { 'value': 2, 'name': 'لاغي' },
        { 'value': 3, 'name': 'تمت الصيانة' },
        { 'value': 4, 'name': 'لم تتم الصيانة' },
        { 'value': 5, 'name': 'موافقة العميل' },
        { 'value': 6, 'name': 'سحب الجهاز' },
        { 'value': 7, 'name': 'منتهي' },
        { 'value': 8, 'name': 'اصدار سند قبض' },
        { 'value': 9, 'name': 'مغلق- المتابعه' },
        { 'value': 11, 'name': 'مغلق -إصدار سند قبض' }
    ];

    userID: number;
    bills: any = {};
    isLoading: boolean = false;

    itemsList: any[] = [];
    warehousesList: any[] = [];
    warehouseMap: Map<number, string> = new Map();

    constructor(
        private fb: FormBuilder,
        private bill: BillsService,
        private itemService: ItemService,
        private warehouseService: WarehousesService,
        private toster: ToastrService,
        private auth: AuthService,
        private spinner: NgxSpinnerService,
        private maintenanceItemService: MaintenanceItemService,
        public dialogRef: MatDialogRef<MaintenanceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.userID = this.auth.getUserId();

        // Initialize with passed data immediately
        this.bills = {
            intro_id: this.data.intro_id,
            devicePor: this.data.devicePor || '',
            request_statues: this.data.request_statues || 0,
            general_Desc: this.data.general_Desc || ''
        };

        this.createForm();
        this.loadMetaData();
    }

    loadMetaData() {
        this.isLoading = true;
        // 1. Load Items and Warehouses first
        forkJoin([
            this.itemService.getAllitem(),
            this.warehouseService.getAllwarehouse()
        ]).subscribe(([items, warehouses]) => {
            this.itemsList = items;
            this.warehousesList = warehouses;

            // Map Warehouse ID to Name for quick lookup
            this.warehousesList.forEach(w => {
                if (w.WarehouseNumber) {
                    this.warehouseMap.set(w.WarehouseNumber, w.WarehouseNameArabic);
                } else if (w.warehouseNumber) {
                    this.warehouseMap.set(w.warehouseNumber, w.warehouseNameArabic);
                }
            });

            // 2. After metadata is loaded, fetch maintenance details and existing parts
            this.loadMaintenanceData();

        }, error => {
            console.error('Error loading metadata:', error);
            this.isLoading = false;
        });
    }

    loadMaintenanceData() {
        forkJoin([
            this.bill.GetMaintenanceIdSilent(this.data.intro_id),
            this.maintenanceItemService.getMaintenanceItems(this.data.intro_id)
        ]).subscribe(([maintenanceDetails, existingParts]) => {

            // Patch Main Details
            if (maintenanceDetails) {
                this.bills = maintenanceDetails;
                this.editMaintenanceForm.patchValue({
                    request_statues: this.bills.request_statues,
                    general_Desc: this.bills.general_Desc
                });
            }

            // Patch Existing Parts
            if (existingParts && Array.isArray(existingParts)) {
                existingParts.forEach(part => {
                    this.addExistingPart(part);
                });
            }

            this.isLoading = false;
        }, (error) => {
            console.error('Error fetching maintenance data:', error);
            this.isLoading = false;
        });
    }

    addExistingPart(partData: any) {
        // PartData is now MaintenanceItemDTO
        const itemId = Number(partData.ItemId || partData.itemId);

        let matchingItem = this.itemsList.find(item => {
            const currentItemId = Number(item.ItemNumber || item.itemNumber);
            return currentItemId === itemId;
        }) || this.itemsList.find(item => {
            // Fallback: Match by name if ID fails
            const itemName = (item.ItemName || item.itemName || '').trim();
            const partName = (partData.ItemName || partData.itemName || '').trim();
            return itemName && partName && itemName === partName;
        });

        // Fallback if item not found in the list (e.g. inactive item)
        if (!matchingItem) {
            console.warn('Part not found in items list, creating temporary item:', partData);
            const fallbackItem = {
                ItemNumber: itemId,
                itemNumber: itemId,
                ItemName: partData.ItemName || partData.Desc_Piece || 'مادة غير معروفة',
                itemName: partData.ItemName || partData.Desc_Piece || 'مادة غير معروفة',
                WarehouseNumber: partData.warehouseNo,
                warehouseNumber: partData.warehouseNo,
                ItemPiece: partData.Price,
                isTemporary: true
            };
            this.itemsList.push(fallbackItem); // Add to list to support mat-select
            matchingItem = fallbackItem;
        }

        if (matchingItem) {
            const partGroup = this.fb.group({
                item: [matchingItem, Validators.required],
                quantity: [partData.Quantity || partData.quantity || 1, [Validators.required, Validators.min(1)]],
                warehouseName: [{ value: '', disabled: true }],
                isExisting: [true], // Mark as existing
                dbId: [partData.Id || partData.id] // Store DB ID for deletion
            });

            // Initialize warehouse name
            const whId = matchingItem.WarehouseNumber || matchingItem.warehouseNumber;
            const whName = this.warehouseMap.get(whId) || 'مستودع غير معروف';
            partGroup.get('warehouseName')?.setValue(whName);

            // Subscribe to changes (same as addPart)
            partGroup.get('item')?.valueChanges.subscribe((selectedItem: any) => {
                if (selectedItem) {
                    const wId = selectedItem.WarehouseNumber || selectedItem.warehouseNumber;
                    const wName = this.warehouseMap.get(wId) || 'مستودع غير معروف';
                    partGroup.get('warehouseName')?.setValue(wName);
                } else {
                    partGroup.get('warehouseName')?.setValue('');
                }
            });

            this.parts.push(partGroup);
        }
    }

    createForm() {
        this.editMaintenanceForm = this.fb.group({
            intro_id: [this.bills.intro_id, Validators.required],
            request_statues: [this.bills.request_statues, Validators.required],
            general_Desc: [this.bills.general_Desc],
            parts: this.fb.array([]) // Array for parts
        });
    }

    get parts(): FormArray {
        return this.editMaintenanceForm.get('parts') as FormArray;
    }

    addPart() {
        const partGroup = this.fb.group({
            item: [null, Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            warehouseName: [{ value: '', disabled: true }] // Readonly
        });

        // Listen to item changes to update warehouse
        partGroup.get('item')?.valueChanges.subscribe((selectedItem: any) => {
            if (selectedItem) {
                const whId = selectedItem.WarehouseNumber || selectedItem.warehouseNumber;
                const whName = this.warehouseMap.get(whId) || 'مستودع غير معروف';
                partGroup.get('warehouseName')?.setValue(whName);
            } else {
                partGroup.get('warehouseName')?.setValue('');
            }
        });

        this.parts.push(partGroup);
    }

    removePart(index: number) {
        const partGroup = this.parts.at(index);
        const isExisting = partGroup.get('isExisting')?.value;

        if (isExisting) {
            const item = partGroup.get('item')?.value;
            const pieceNumber = item.ItemNumber || item.itemNumber;

            if (confirm('هل أنت متأكد من حذف هذه القطعة نهائياً؟')) {
                const dbId = partGroup.get('dbId')?.value;
                if (!dbId) {
                    // Should not happen for existing parts
                    this.parts.removeAt(index);
                    return;
                }

                this.spinner.show();
                this.maintenanceItemService.deleteMaintenanceItem(dbId).subscribe(() => {
                    this.parts.removeAt(index);
                    this.spinner.hide();
                }, error => {
                    this.spinner.hide();
                    console.error('Failed to delete part', error);
                    this.toster.error('فشل حذف القطعة');
                });
            }
        } else {
            this.parts.removeAt(index);
        }
    }

    addNewItemOption() {
        this.toster.info("سيتم إضافة مادة جديدة قريبًا");
    }

    isSaving: boolean = false;

    onSubmit() {
        if (this.isSaving) return;

        if (!this.editMaintenanceForm.valid) {
            this.toster.warning("يرجى تعبئة جميع الحقول المطلوبة");
            return;
        }

        this.isSaving = true;
        this.spinner.show();

        // 1. Save Maintenance Status
        let maintenanceFormValue = { ...this.editMaintenanceForm.value };
        if (typeof maintenanceFormValue.request_statues === 'object' && maintenanceFormValue.request_statues !== null) {
            maintenanceFormValue.request_statues = maintenanceFormValue.request_statues.value;
        }

        const saveMaintenance$ = this.bill.saveMaintenanceSimple(maintenanceFormValue).pipe(
            catchError(err => {
                console.error('Error saving maintenance details:', err);
                return of({ hasError: true, type: 'main', error: err });
            })
        );

        // 2. Save Parts (only new ones)
        const parts = this.parts.controls;
        const processedPieceNumbers = new Set<number>();

        const partObservables = parts
            .filter(control => !control.get('isExisting')?.value) // Filter out existing parts
            .map(control => {
                const partVal = control.getRawValue();
                const item = partVal.item;

                // Ensure valid data
                const warehouseNo = item.WarehouseNumber || item.warehouseNumber;
                const pieceNumber = item.ItemNumber || item.itemNumber;
                const descPiece = item.ItemName || item.itemName;

                if (!warehouseNo || !pieceNumber) {
                    console.warn('Skipping part due to missing data:', item);
                    return null;
                }

                // Prevent duplicates in the same save request
                if (processedPieceNumbers.has(pieceNumber)) {
                    return null;
                }
                processedPieceNumbers.add(pieceNumber);

                // Construct model for saveWarehouse
                // Construct model for new AddMaintenanceItem API
                const dto = {
                    MaintenanceId: this.bills.intro_id,
                    ItemId: pieceNumber,
                    ItemName: descPiece,
                    Quantity: partVal.quantity,
                    Price: item.ItemPiece || item.itemPiece || 0, // Get price from Item definition
                    Total: 0 // Backend calculates or ignores
                };

                return this.maintenanceItemService.addMaintenanceItem(dto).pipe(
                    catchError(err => {
                        console.error('Error saving part:', descPiece, err);
                        return of({ hasError: true, type: 'part', item: descPiece, error: err });
                    })
                );
            })
            .filter(obs => obs !== null);

        // Execute all
        const tasks = [saveMaintenance$, ...partObservables];

        forkJoin(tasks).subscribe((results: any[]) => {
            this.spinner.hide();

            // Check results
            const mainResult = results[0];
            const partResults = results.slice(1);

            const mainFailed = mainResult && mainResult.hasError;
            const failedParts = partResults.filter(r => r && r.hasError);

            if (mainFailed) {
                this.toster.error("فشل حفظ حالة الصيانة");
            } else if (failedParts.length > 0) {
                this.toster.warning(`تم حفظ الحالة ولكن فشل حفظ ${failedParts.length} من القطع`);
                this.dialogRef.close(true);
            } else {
                this.toster.success("تم الحفظ بنجاح");
                this.dialogRef.close(true);
            }
        }, error => {
            this.spinner.hide();
            this.isSaving = false;
            this.toster.error("حدث خطأ غير متوقع");
            console.error(error);
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
