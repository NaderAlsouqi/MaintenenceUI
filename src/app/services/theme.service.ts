import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeName = 'light' | 'purple-light';

export interface ThemeOption {
    name: ThemeName;
    label: string;
    icon: string;
    swatch: string;        // Primary swatch color for the picker UI
    swatchBg: string;      // Background swatch color
}

export const THEME_OPTIONS: ThemeOption[] = [
    {
        name: 'light',
        label: 'ازرق',
        icon: 'light_mode',
        swatch: '#6366f1',
        swatchBg: '#f8fafc'
    },
    {
        name: 'purple-light',
        label: 'بنفسجي',
        icon: 'palette',
        swatch: '#a4508b',
        swatchBg: '#f8f0f6'
    }
];

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly STORAGE_KEY = 'app-theme';
    private themeSubject = new BehaviorSubject<ThemeName>(this.getStoredTheme());
    theme$ = this.themeSubject.asObservable();

    readonly themes = THEME_OPTIONS;

    constructor() {
        this.applyTheme(this.getStoredTheme());
    }

    get currentTheme(): ThemeName {
        return this.themeSubject.value;
    }

    get currentThemeOption(): ThemeOption {
        return THEME_OPTIONS.find(t => t.name === this.currentTheme) || THEME_OPTIONS[0];
    }

    setTheme(theme: ThemeName): void {
        this.themeSubject.next(theme);
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.applyTheme(theme);
    }

    cycleTheme(): void {
        const currentIndex = THEME_OPTIONS.findIndex(t => t.name === this.currentTheme);
        const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
        this.setTheme(THEME_OPTIONS[nextIndex].name);
    }

    private getStoredTheme(): ThemeName {
        const stored = localStorage.getItem(this.STORAGE_KEY) as ThemeName;
        if (stored && THEME_OPTIONS.some(t => t.name === stored)) {
            return stored;
        }
        return 'light';
    }

    private applyTheme(theme: ThemeName): void {
        const body = document.body;
        // Remove all theme classes
        THEME_OPTIONS.forEach(t => body.classList.remove(`theme-${t.name}`));
        // Add the current one
        body.classList.add(`theme-${theme}`);
    }
}
