import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DemoService } from './services/demo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Shows the small "Demo — sample data" badge when running in the public iframe preview.
  demoMode = false;

  constructor(private translate: TranslateService, private demo: DemoService) {
    // Set default language
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('ar');

    const browserLang = this.translate.getBrowserLang();
    const langToUse = browserLang?.match(/en|ar/) ? browserLang : 'ar';

    // Check saved language or use default
    const savedLang = localStorage.getItem('lang') || langToUse;
    this.translate.use(savedLang);
  }

  ngOnInit() {
    this.demoMode = this.demo.isDemo();

    this.translate.onLangChange.subscribe((event) => {
      this.updateDirection(event.lang);
      localStorage.setItem('lang', event.lang);
    });

    // Initial direction set
    this.updateDirection(this.translate.currentLang || 'ar');
  }

  private updateDirection(lang: string) {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;

    // Optional: Add/remove classes for CSS targeting
    if (dir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
}
