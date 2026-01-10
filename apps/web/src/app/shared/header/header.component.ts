import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ITheme } from '../interfaces/header.model';

@Component({
  selector: 'rc-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  theme: ITheme = 'light';

  toggleTheme(): void {
    // Toggle the theme
    if (this.theme === 'light') {
      this.theme = 'dark';
      localStorage['theme'] = 'dark';
    } else {
      this.theme = 'light';
      localStorage['theme'] = 'light';
    }

    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark');
  }

  ngOnInit(): void {
    // Set theme based on user's preferences
    if (
      localStorage['theme'] === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      this.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      this.theme = 'light';
    }
  }
}
