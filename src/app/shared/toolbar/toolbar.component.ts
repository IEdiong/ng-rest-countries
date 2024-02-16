import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'rc-toolbar',
  templateUrl: './toolbar.component.html',
  styles: [],
})
export class ToolbarComponent {
  @Input() searchForm!: FormControl;
  @Output() regionSelected = new EventEmitter<string>();

  selectRegion(region: string) {
    this.regionSelected.emit(region);
  }
}
