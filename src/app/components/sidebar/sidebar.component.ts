import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  key?: string; // Translation key
  icon: string;
  class: string;
  subMenuVisible?: boolean;
  subMenuVisible1?: boolean;
  subMenuVisible2?: boolean;
  subRouteInfo?: RouteInfo[];
  subRouteInfo2?: RouteInfo[];

}


export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'الصفحة الرئيسية', key: 'SIDEBAR.DASHBOARD', icon: 'dashboard', class: '', subMenuVisible: false },
  {
    path: '/d', title: 'نظام الصيانة', key: 'SIDEBAR.MAINTENANCE_SYSTEM', icon: 'build', class: '', subMenuVisible: false,
    subRouteInfo: [
      { path: '/maintenance', title: 'طلبات الصيانة', key: 'SIDEBAR.MAINTENANCE_REQUESTS', icon: 'record_voice_over', class: '', subMenuVisible: false },
      { path: '/manager', title: 'مدير الصيانة', key: 'SIDEBAR.MAINTENANCE_MANAGER', icon: 'perm_identity', class: '', subMenuVisible: false },
      { path: '/maintenanceTechnician', title: 'فني الصيانة', key: 'SIDEBAR.MAINTENANCE_TECHNICIAN', icon: 'supervisor_account', class: '', subMenuVisible: false },
      { path: '/bills', title: 'المدير المالي', key: 'SIDEBAR.BILLS', icon: 'receipt_long', class: '', subMenuVisible1: false },
      { path: '/after-maintenance', title: 'متابعه', key: 'SIDEBAR.FOLLOW_UP', icon: 'touch_app', class: '', subMenuVisible: false },
      { path: '/enquiry', title: 'استعلام', key: 'SIDEBAR.ENQUIRY', icon: 'pie_chart', class: '', subMenuVisible: false },
      { path: '/scheduledMaintenance', title: 'الصيانة الدورية', key: 'SIDEBAR.SCHEDULED_MAINTENANCE', icon: 'pending_actions', class: '', subMenuVisible: false },
    ]
  },
  {
    path: '/s', title: 'التعريفات', key: 'SIDEBAR.DEFINITIONS', icon: 'settings_applications', class: '', subMenuVisible: false,
    subRouteInfo: [
      { path: '/customer', title: 'العملاء', key: 'SIDEBAR.CUSTOMERS', icon: 'supervisor_account', class: '', subMenuVisible: false },
      { path: '/opposed', title: 'المعارض', key: 'SIDEBAR.EXHIBITIONS', icon: 'location_city', class: '', subMenuVisible: false },
      { path: '/area', title: 'المناطق ', key: 'SIDEBAR.AREAS', icon: 'location_on', class: '', subMenuVisible: false },
      { path: '/technicians-definition', title: 'تعريف الفنيين', key: 'SIDEBAR.TECHNICIANS_DEFINITION', icon: 'engineering', class: '', subMenuVisible: false },
      { path: '/Warehouse', title: 'المستودعات', key: 'SIDEBAR.WAREHOUSES', icon: 'people_outline', class: '', subMenuVisible: false },
      { path: '/Item', title: 'المواد', key: 'SIDEBAR.ITEMS', icon: 'build', class: '', subMenuVisible: false },
      { path: '/DeviceDEC', title: 'تعريف الأجهزة', key: 'SIDEBAR.DEVICES', icon: 'personal_video', class: '', subMenuVisible: false },
      { path: '/fault', title: 'تعريف الأعطال', key: 'SIDEBAR.FAULTS', icon: 'Fault', class: '', subMenuVisible: false },
      { path: '/tax-definition', title: 'تعريف الضرائب', key: 'SIDEBAR.TAX_DEFINITION', icon: 'request_quote', class: '', subMenuVisible: false },
      { path: '/logs', title: 'سجل العمليات', key: 'SIDEBAR.LOGS', icon: 'history', class: '', subMenuVisible: false },
    ]
  },
];
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  jwtHelper = new JwtHelperService();
  username: any;
  userrole: any;
  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    const user = localStorage.getItem('token')?.toString();
    if (user != null) {
      const decodedToken = this.jwtHelper.decodeToken(user);
      this.username = decodedToken.unique_name;
      this.userrole = decodedToken.role_id;

      const userRole = Number(this.userrole);

      // Check the user's role and set the default route accordingly
      switch (userRole) {
        case 9: // Admin role
          // Display all menu items
          this.filterMenuItemsByRole();
          break;

        case 1: // Maintenance Manager role
          // Display certain menu items based on user role requirements
          this.filterMenuItemsByRole();
          break;

        case 3: // Technician role
          // Display certain menu items based on user role requirements
          this.filterMenuItemsByRole();
          // Redirect to 'فني الصيانة' when a Technician logs in
          this.router.navigate(['/maintenanceTechnician']);
          break;

        case 6: // Accountant role
          // Display only bills menu item
          this.filterMenuItemsByRole();
          // Redirect to 'سندات القبض' when an Accountant logs in
          this.router.navigate(['/bills']);
          break;

        case 7: // مسؤول المتابعة role
          // Display certain menu items based on user role requirements
          this.filterMenuItemsByRole();
          break;

        case 8: // الاستعلام role
          // Display certain menu items based on user role requirements
          this.filterMenuItemsByRole();
          break;

        // Add additional cases for other roles if needed

        default:
          // Display no menu items for unknown roles
          this.menuItems = [];
          break;
      }
    }

    // Auto-expand the parent menu that contains the current route
    this.expandActiveMenu();

    // Keep menus in sync on navigation changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.expandActiveMenu();
      });
  }

  filterMenuItemsByRole() {
    // Define the user's role
    const userRole = Number(this.userrole);

    // Create a copy of the original menu items
    var filteredMenuItems: RouteInfo[] = JSON.parse(JSON.stringify(ROUTES));

    // Filter the menu items based on the user's role
    for (const menuItem of filteredMenuItems) {
      if (menuItem.subRouteInfo) {
        // Filter sub-menu items based on user role
        menuItem.subRouteInfo = menuItem.subRouteInfo.filter((subItem) => {
          switch (userRole) {
            case 1: // Maintenance Manager role
              return (
                subItem.path === '/manager' ||
                subItem.path === '/maintenance' ||
                subItem.title === 'مدير الصيانة' ||
                subItem.title === 'طلبات الصيانة'
              );

            case 3: // Technician role
              return (
                subItem.path === '/maintenanceTechnician' ||
                subItem.title === 'فني الصيانة'
              );

            case 6: // Accountant role
              return (
                subItem.path === '/bills' ||
                subItem.title === 'سندات القبض'
              );

            case 7: // مسؤول المتابعة role
              return subItem.path === '/after-maintenance';

            case 8: // الاستعلام
              return subItem.path === '/enquiry';

            case 9: // Admin role
              return true;

            default:
              return false;
          }
        });

      }
    }

    // Filter out parent items that have an empty subRouteInfo (if they originally had one)
    this.menuItems = filteredMenuItems.filter(menuItem => {
      if (menuItem.subRouteInfo) {
        return menuItem.subRouteInfo.length > 0;
      }
      return true; // Keep items without subRouteInfo (like Dashboard)
    });
  }


  expandActiveMenu() {
    const currentUrl = this.router.url; // e.g. '/maintenance' or '/customer'

    for (const menuItem of this.menuItems) {
      if (menuItem.subRouteInfo && menuItem.subRouteInfo.length > 0) {
        const hasActiveChild = menuItem.subRouteInfo.some(
          (sub: RouteInfo) => currentUrl === sub.path || currentUrl.startsWith(sub.path + '/')
        );
        // Explicitly set visibility: true if it has an active child, false otherwise
        menuItem.subMenuVisible = hasActiveChild;
      }
    }
  }

  toggleSubMenu(item: RouteInfo) {
    // If this item has sub-routes, toggle it and collapse others
    if (item.subRouteInfo && item.subRouteInfo.length > 0) {
      const targetState = !item.subMenuVisible;

      // Collapse all parent menus first
      this.menuItems.forEach(menuItem => {
        if (menuItem.subRouteInfo) {
          menuItem.subMenuVisible = false;
        }
      });

      // Set the toggled item to its new state
      item.subMenuVisible = targetState;
    }
  }

  toggleSubMenu1(item: RouteInfo, menuItem: RouteInfo) {
    item.subMenuVisible1 = !item.subMenuVisible1;
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}