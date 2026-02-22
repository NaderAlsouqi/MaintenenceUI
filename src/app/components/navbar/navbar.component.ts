import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'app/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { ThemeService, ThemeName, ThemeOption, THEME_OPTIONS } from 'app/services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    jwtHelper = new JwtHelperService();
    username: any;
    userrole: any;
    currentTheme: ThemeName = 'light';
    themeMenuOpen = false;
    themes: ThemeOption[] = THEME_OPTIONS;

    get currentThemeOption(): ThemeOption {
        return this.themeService.currentThemeOption;
    }

    currentLang = 'ar';

    constructor(location: Location, private tostar: ToastrService, private element: ElementRef,
        private router: Router, private dialog: MatDialog, private themeService: ThemeService,
        private translate: TranslateService) {

        this.location = location;
        this.sidebarVisible = false;
        this.currentTheme = this.themeService.currentTheme;
        this.currentLang = this.translate.currentLang || 'ar';
    }

    ngOnInit() {
        const user = localStorage.getItem('token')?.toString();
        if (user != null) {
            const decodetoken = this.jwtHelper.decodeToken(user);
            this.username = decodetoken.unique_name;
            this.userrole = decodetoken.role_id;
        }

        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler-modern')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });

    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler-modern')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                const key = this.listTitles[item].key;
                return key ? this.translate.instant(key) : this.listTitles[item].title;
            }
            else {
                if (this.listTitles[item].subRouteInfo)
                    for (var subMenu = 0; subMenu < this.listTitles[item].subRouteInfo.length; subMenu++) {
                        if (this.listTitles[item].subRouteInfo[subMenu].path === titlee) {
                            const key = this.listTitles[item].subRouteInfo[subMenu].key;
                            return key ? this.translate.instant(key) : this.listTitles[item].subRouteInfo[subMenu].title;
                        }
                    }
            }
        }
        return 'Dashboard';
    }
    openDialog() {
        const dialogRef =
            this.dialog.open(ChangePasswordComponent, {
                width: '30%',

            })
    }

    logout() {
        localStorage.removeItem("token");
        this.router.navigate(['/auth/login']);
        this.tostar.success('logged out !')
    }

    // --- Theme Picker ---
    toggleThemeMenu(event: Event) {
        event.stopPropagation();
        this.themeMenuOpen = !this.themeMenuOpen;
    }

    selectTheme(themeName: ThemeName) {
        this.themeService.setTheme(themeName);
        this.currentTheme = themeName;
        this.themeMenuOpen = false;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        const target = event.target as HTMLElement;
        const wrapper = this.element.nativeElement.querySelector('.theme-picker-wrapper');
        if (wrapper && !wrapper.contains(target)) {
            this.themeMenuOpen = false;
        }
    }

    switchLanguage(lang: string) {
        this.translate.use(lang);
        this.currentLang = lang;
        // Broadcast or local storage already handled in AppComponent
    }

}
