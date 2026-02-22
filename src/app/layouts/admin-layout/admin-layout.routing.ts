import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { DeliveryComponent } from '../../delivery/delivery.component';
import { ScreensComponent } from 'app/screens/screens.component';
import { CustomersComponent } from 'app/customers/customers.component';
import { AddCustomersComponent } from 'app/add-customers/add-customers.component';
import { OpposedComponent } from 'app/opposed/opposed.component';
import { AddOpposedComponent } from 'app/add-opposed/add-opposed.component';
import { AreaComponent } from 'app/area/area.component';
import { FaultComponent } from 'app/fault/fault.component';
import { AddAreaComponent } from 'app/add-area/add-area.component';
import { AddRepresentativeComponent } from 'app/add-representative/add-representative.component';
import { RepresentativeComponent } from 'app/representative/representative.component';
import { AddTechnicalComponent } from 'app/add-technical/add-technical.component';
import { TechnicalComponent } from 'app/technical/technical.component';
import { BillsComponent } from 'app/bills/bills.component';
import { AfterMaintenancComponent } from 'app/after-maintenanc/after-maintenanc.component';
import { MaintenanceRequestsComponent } from 'app/maintenance-requests/maintenance-requests.component';
import { AddmaintenancerequestsComponent } from 'app/add-maintenance-requests/add-maintenance-requests.component';
import { MaintenanceManagerComponent } from 'app/maintenance-manager/maintenance-manager.component';
import { MaintenanceTechnicianComponent } from 'app/maintenance-technician/maintenance-technician.component';
import { EnquiryComponent } from 'app/enquiry/enquiry.component';
import { ViewOpposedComponent } from 'app/view-opposed/view-opposed.component';
import { EditMaintenanceRequestsComponent } from 'app/edit-maintenance-requests/edit-maintenance-requests.component';
import { DefineDevicesComponent } from 'app/define-devices/define-devices.component';
import { FollowMaintComponent } from 'app/follow-maint/follow-maint.component';
import { BillMaintenancComponent } from 'app/bill-maintenanc/bill-maintenanc.component';
import { MaintenancemaintenanceComponent } from 'app/maintenancemaintenance/maintenancemaintenance.component';

import { ViewMaintenanceRequestsComponent } from 'app/view-maintenance-requests/view-maintenance-requests.component';
import { ViewAreaComponent } from 'app/view-area/view-area.component';
import { EditAreaComponent } from 'app/edit-area/edit-area.component';
import { AuthModule } from 'app/auth/auth.module';
import { AddUserComponent } from 'app/add-user/add-user.component';
import { AddExhibitionUserComponent } from 'app/add-exhibition-user/add-exhibition-user.component';
import { ViewBillMaintenancComponent } from 'app/view-bill-maintenanc/view-bill-maintenanc.component';
import { ScheduledMaintenanceComponent } from 'app/scheduled-maintenance/scheduled-maintenance.component';
import { WarehouseComponent } from 'app/warehouse/warehouse.component';
import { ItemComponent } from 'app/item/item.component';
import { ConvertBillsComponent } from 'app/convert-bills/convert-bills.component';
import { ConvertWarehousesComponent } from 'app/convert-warehouses/convert-warehouses.component';
import { AllDeviceDECComponent } from 'app/all-device-dec/all-device-dec.component';
import { RoleGuard } from 'app/guards/role.guard';
import { TechniciansDefinitionComponent } from 'app/technicians-definition/technicians-definition.component';
import { LogsComponent } from 'app/logs/logs.component';
import { TaxDefinitionComponent } from 'app/tax-definition/tax-definition.component';


export const AdminLayoutRoutes: Routes = [
    // الصفحات المتاحة لجميع المستخدمين
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },

    // صفحة سندات القبض - متاحة للمحاسب (6) والأدمن (9)
    {
        path: 'bills',
        component: BillsComponent,
        canActivate: [RoleGuard],
        data: { roles: [6, 9] }
    },

    // صفحات الصيانة - متاحة لمدير الصيانة (1) والأدمن (9)
    {
        path: 'maintenance',
        component: MaintenanceRequestsComponent,
        canActivate: [RoleGuard],
        data: { roles: [1, 9] }
    },
    {
        path: 'manager',
        component: MaintenanceManagerComponent,
        canActivate: [RoleGuard],
        data: { roles: [1, 9] }
    },
    {
        path: 'addrequests',
        component: AddmaintenancerequestsComponent,
        canActivate: [RoleGuard],
        data: { roles: [1, 9] }
    },
    {
        path: 'editrequests',
        component: EditMaintenanceRequestsComponent,
        canActivate: [RoleGuard],
        data: { roles: [1, 9] }
    },
    {
        path: 'viewrequests',
        component: ViewMaintenanceRequestsComponent,
        canActivate: [RoleGuard],
        data: { roles: [1, 9] }
    },

    // صفحة فني الصيانة - متاحة للفني (3) والأدمن (9)
    {
        path: 'maintenanceTechnician',
        component: MaintenanceTechnicianComponent,
        canActivate: [RoleGuard],
        data: { roles: [3, 9] }
    },

    // صفحة المتابعة - متاحة لمسؤول المتابعة (7) والأدمن (9)
    {
        path: 'after-maintenance',
        component: AfterMaintenancComponent,
        canActivate: [RoleGuard],
        data: { roles: [7, 9] }
    },
    {
        path: 'Followmaint',
        component: FollowMaintComponent,
        canActivate: [RoleGuard],
        data: { roles: [7, 9] }
    },

    // صفحة الاستعلام - متاحة للاستعلام (8) والأدمن (9)
    {
        path: 'enquiry',
        component: EnquiryComponent,
        canActivate: [RoleGuard],
        data: { roles: [8, 9] }
    },

    // صفحات التعريفات - متاحة للأدمن فقط (9)
    {
        path: 'add',
        component: AddCustomersComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'customer',
        component: CustomersComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'opposed',
        component: OpposedComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'addopposed',
        component: AddOpposedComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'area',
        component: AreaComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'addArea',
        component: AddAreaComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'view-area',
        component: ViewAreaComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'representative',
        component: RepresentativeComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'addrepresentative',
        component: AddRepresentativeComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'technical',
        component: TechnicalComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'addTechnical',
        component: AddTechnicalComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'Warehouse',
        component: WarehouseComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'Item',
        component: ItemComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'DeviceDEC',
        component: AllDeviceDECComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'fault',
        component: FaultComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'devices',
        component: DefineDevicesComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'addUser',
        component: AddUserComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'technicians-definition',
        component: TechniciansDefinitionComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'scheduledMaintenance',
        component: ScheduledMaintenanceComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'convertBills',
        component: ConvertBillsComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'convertWarehouses',
        component: ConvertWarehousesComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },

    // صفحات الفواتير والمعاينة - متاحة للأدمن
    {
        path: 'viewbills',
        component: ViewBillMaintenancComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'billmaintenanc/:id',
        component: BillMaintenancComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'Maintenancemaintenance/:id',
        component: MaintenancemaintenanceComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'logs',
        component: LogsComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    },
    {
        path: 'tax-definition',
        component: TaxDefinitionComponent,
        canActivate: [RoleGuard],
        data: { roles: [9] }
    }
];
