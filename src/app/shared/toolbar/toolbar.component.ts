import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'rc-toolbar',
  templateUrl: './toolbar.component.html',
  styles: [],
})
export class ToolbarComponent {
  @Output() regionSelected = new EventEmitter<string>();

  selectRegion(region: string) {
    this.regionSelected.emit(region);
  }
}
