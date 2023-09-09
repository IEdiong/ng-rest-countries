import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgIconsModule } from '@ng-icons/core';
import { ionMoonOutline, ionSunny } from '@ng-icons/ionicons';

import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    NgIconsModule.withIcons({ ionMoonOutline, ionSunny }),
  ],
  exports: [CommonModule, HeaderComponent],
})
export class SharedModule {}
