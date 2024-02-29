import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'rc-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  regions: string[] = [];
  menuIsOpen: boolean = false;
  @Output() regionSelected = new EventEmitter<string>();

  ngOnInit(): void {
    this.regions = ['Africa', 'America', 'Asia', 'Europe', 'Oceania'];
  }

  toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
    // console.log('menu is toggled');
  }

  onRegionSelected(region: MouseEvent): void {
    const el = region.target as HTMLElement;
    const selectedRegion = el.textContent?.trim().toLowerCase();

    // console.log(selectedRegion);
    if (selectedRegion === 'america') {
      this.regionSelected.emit('americas');
    } else {
      this.regionSelected.emit(selectedRegion);
    }
  }
}
