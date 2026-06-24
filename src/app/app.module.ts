import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ScreensComponent } from './screens/screens.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { CustomersComponent } from './customers/customers.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OpposedComponent } from './opposed/opposed.component';
import { AddOpposedComponent } from './add-opposed/add-opposed.component';
import { AreaComponent } from './area/area.component';
import { AddAreaComponent } from './add-area/add-area.component';
import { RepresentativeComponent } from './representative/representative.component';
import { AddRepresentativeComponent } from './add-representative/add-representative.component';
import { TechnicalComponent } from './technical/technical.component';
import { AddTechnicalComponent } from './add-technical/add-technical.component';
import { EditCustomersComponent } from './edit-customers/edit-customers.component';
import { BillsComponent } from './bills/bills.component';
import { AfterMaintenancComponent } from './after-maintenanc/after-maintenanc.component';
import { MaintenanceRequestsComponent } from './maintenance-requests/maintenance-requests.component';
import { MaintenanceManagerComponent } from './maintenance-manager/maintenance-manager.component';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { AddmaintenancerequestsComponent } from './add-maintenance-requests/add-maintenance-requests.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { MaintenanceTechnicianComponent } from './maintenance-technician/maintenance-technician.component';
import { ViewCustomerDialogComponent } from './view-customer-dialog/view-customer-dialog.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ViewOpposedComponent } from './view-opposed/view-opposed.component';
import { EditMaintenanceRequestsComponent } from './edit-maintenance-requests/edit-maintenance-requests.component';
import { EditOpposedComponent } from './edit-opposed/edit-opposed.component';
import { EditRepresentativeComponent } from './edit-representative/edit-representative.component';
import { EditTechnicalComponent } from './edit-technical/edit-technical.component';
import { ViewAreaComponent } from './view-area/view-area.component';
import { ViewRepresentativeComponent } from './view-representative/view-representative.component';
import { ViewTechnicalComponent } from './view-technical/view-technical.component';
import { DefineDevicesComponent } from './define-devices/define-devices.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FollowMaintComponent } from './follow-maint/follow-maint.component';
import { BillMaintenancComponent } from './bill-maintenanc/bill-maintenanc.component';
import { MaintenancemaintenanceComponent } from './maintenancemaintenance/maintenancemaintenance.component';
import { ViewMaintenanceRequestsComponent } from './view-maintenance-requests/view-maintenance-requests.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddExhibitionUserComponent } from './add-exhibition-user/add-exhibition-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditExhibitionUserComponent } from './edit-exhibition-user/edit-exhibition-user.component';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { MatMenuModule } from '@angular/material/menu';
import { ViewBillMaintenancComponent } from './view-bill-maintenanc/view-bill-maintenanc.component';
import { ScheduledMaintenanceComponent } from './scheduled-maintenance/scheduled-maintenance.component';
import { AddScheduledMaintenanceComponent } from './add-scheduled-maintenance/add-scheduled-maintenance.component';
import { EditScheduledMaintenanceComponent } from './edit-scheduled-maintenance/edit-scheduled-maintenance.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { FaultComponent } from './fault/fault.component';
import { ItemComponent } from './item/item.component';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { AddNewFaultComponent } from './add-new-fault/add-new-fault.component';
import { EditNewItemComponent } from './edit-new-item/edit-new-item.component';
import { ViewNewItemComponent } from './view-new-item/view-new-item.component';
import { AddWarehouseComponent } from './add-warehouse/add-warehouse.component';
import { EditWarehouseComponent } from './edit-warehouse/edit-warehouse.component';
import { ViewWarehouseComponent } from './view-warehouse/view-warehouse.component';
import { ViewAttachmentsDialogComponent } from './view-attachments-dialog/view-attachments-dialog.component';
import { AttachmentUploadDialogComponent } from './attachment-upload-dialog/attachment-upload-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AllDeviceDECComponent } from './all-device-dec/all-device-dec.component';
import { AddDeviceDECComponent } from './add-device-dec/add-device-dec.component';

import { ConvertBillsComponent } from './convert-bills/convert-bills.component';
import { ConvertWarehousesComponent } from './convert-warehouses/convert-warehouses.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditDeviceDECComponent } from './edit-device-dec/edit-device-dec.component';
import { VewiDeviceDECComponent } from './vewi-device-dec/vewi-device-dec.component';
import { ViewFaultComponent } from './view-fault/view-fault.component';
import { EditFaultComponent } from './edit-fault/edit-fault.component';

import { AddExhibitionDialogComponent } from './add-exhibition-dialog/add-exhibition-dialog.component';
import { MaintenanceDialogComponent } from './maintenance-dialog/maintenance-dialog.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './shared/custom-paginator';
import { TechniciansDefinitionComponent } from './technicians-definition/technicians-definition.component';
import { AddTechnicianUserDialogComponent } from './add-technician-user-dialog/add-technician-user-dialog.component';
import { EditTechnicianUserDialogComponent } from './edit-technician-user-dialog/edit-technician-user-dialog.component';
import { LogsComponent } from './logs/logs.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TaxDefinitionComponent } from './tax-definition/tax-definition.component';
import { TaxModalComponent } from './tax-modal/tax-modal.component';
import { ReceiptModalComponent } from './receipt-modal/receipt-modal.component';
import { DemoService } from './services/demo.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Runs demo auto-login (when the app is opened with ?demo=1) BEFORE the router and auth
// guards activate, so the visitor lands straight on the dashboard with a demo session.
export function initDemoFactory(demo: DemoService) {
  return () => demo.initDemoSession();
}






@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    MatCheckboxModule,
    RouterModule,
    AppRoutingModule,
    ToastNoAnimationModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    BrowserModule,
    MatToolbarModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })




  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    UserProfileComponent,
    ScreensComponent,
    AddCustomersComponent,
    CustomersComponent,
    OpposedComponent,
    AddOpposedComponent,
    AreaComponent,
    AddAreaComponent,
    RepresentativeComponent,
    AddRepresentativeComponent,
    TechnicalComponent,
    AddTechnicalComponent,
    EditCustomersComponent,
    BillsComponent,
    AfterMaintenancComponent,
    AddmaintenancerequestsComponent,
    MaintenanceRequestsComponent,
    MaintenanceManagerComponent,
    EditAreaComponent,
    EnquiryComponent,
    MaintenanceTechnicianComponent,
    ViewCustomerDialogComponent,
    ViewOpposedComponent,
    EditMaintenanceRequestsComponent,
    EditOpposedComponent,
    EditRepresentativeComponent,
    EditTechnicalComponent,
    ViewAreaComponent,
    ViewRepresentativeComponent,
    ViewTechnicalComponent,
    DefineDevicesComponent,
    FollowMaintComponent,
    BillMaintenancComponent,
    MaintenancemaintenanceComponent,
    ViewMaintenanceRequestsComponent,
    RegisterComponent,
    ChangePasswordComponent,
    AddExhibitionUserComponent,
    AddUserComponent,
    AddNewUserComponent,
    ViewUserComponent,
    EditUserComponent,
    EditExhibitionUserComponent,
    DialogContentComponent,
    ViewBillMaintenancComponent,
    ScheduledMaintenanceComponent,
    AddScheduledMaintenanceComponent,
    EditScheduledMaintenanceComponent,
    WarehouseComponent,
    ItemComponent,
    AddNewItemComponent,
    AddNewFaultComponent,
    EditNewItemComponent,
    ViewNewItemComponent,
    AddWarehouseComponent,
    EditWarehouseComponent,
    ViewWarehouseComponent,
    ViewAttachmentsDialogComponent,
    AttachmentUploadDialogComponent,
    ConvertBillsComponent,
    ConvertWarehousesComponent,
    AllDeviceDECComponent,
    AddDeviceDECComponent,
    EditDeviceDECComponent,
    VewiDeviceDECComponent,
    FaultComponent,
    ViewFaultComponent,
    EditFaultComponent,

    AddExhibitionDialogComponent,
    MaintenanceDialogComponent,
    TechniciansDefinitionComponent,
    AddTechnicianUserDialogComponent,
    AddTechnicianUserDialogComponent,
    EditTechnicianUserDialogComponent,
    LogsComponent,
    TaxDefinitionComponent,
    TaxModalComponent,
    ReceiptModalComponent


  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    {
      // Demo auto-login must complete before the auth guard runs (see initDemoFactory).
      provide: APP_INITIALIZER,
      useFactory: initDemoFactory,
      deps: [DemoService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }