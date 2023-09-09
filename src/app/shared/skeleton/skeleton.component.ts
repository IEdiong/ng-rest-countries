import { Component, Input } from '@angular/core';

@Component({
  selector: 'rc-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent {
  @Input() loading: boolean = false;
  @Input() width!: string;
}
