import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FilterComponent } from '@shared/filter/filter.component';
import { SearchbarComponent } from '@shared/searchbar/searchbar.component';

@Component({
  selector: 'rc-toolbar',
  templateUrl: './toolbar.component.html',
  imports: [SearchbarComponent, FilterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input() searchForm!: FormControl;
  @Output() regionSelected = new EventEmitter<string>();

  selectRegion(region: string) {
    this.regionSelected.emit(region);
  }
}
