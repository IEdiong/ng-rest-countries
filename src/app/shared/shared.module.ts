import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgIconsModule } from '@ng-icons/core';
import { ionMoonOutline, ionSunny } from '@ng-icons/ionicons';

import { HeaderComponent } from './header/header.component';
import { SkeletonComponent } from './skeleton/skeleton.component';

@NgModule({
  declarations: [HeaderComponent, SkeletonComponent],
  imports: [
    CommonModule,
    NgIconsModule.withIcons({ ionMoonOutline, ionSunny }),
  ],
  exports: [CommonModule, HeaderComponent, SkeletonComponent],
})
export class SharedModule {}
