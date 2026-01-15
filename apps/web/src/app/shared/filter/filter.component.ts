import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';

@Component({
  selector: 'rc-filter',
  templateUrl: './filter.component.html',
  imports: [NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  regions: string[] = [];
  selectedRegion = signal<string | undefined>(undefined);
  @Output() regionSelected = new EventEmitter<string>();

  ngOnInit(): void {
    this.regions = ['Africa', 'America', 'Asia', 'Europe', 'Oceania'];
  }

  onRegionSelected(region: string): void {
    // console.log(region);
    if (region.toLowerCase() === 'america') {
      this.regionSelected.emit('americas');
    } else {
      this.regionSelected.emit(region.toLowerCase());
    }
  }
}
