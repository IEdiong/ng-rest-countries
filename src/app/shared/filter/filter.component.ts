import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rc-filter',
  templateUrl: './filter.component.html',
  styles: [],
})
export class FilterComponent implements OnInit {
  regions: string[] = [];
  menuIsOpen: boolean = false;

  ngOnInit(): void {
    this.regions = ['Africa', 'America', 'Asia', 'Europe', 'Oceania'];
  }

  toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
    console.log('menu is toggled');
  }
}
