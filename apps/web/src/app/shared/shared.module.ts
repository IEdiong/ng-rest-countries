import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgIconsModule } from '@ng-icons/core';
import { ionMoonOutline, ionSunny } from '@ng-icons/ionicons';

import { HeaderComponent } from './header/header.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SkeletonComponent,
    ToolbarComponent,
    SearchbarComponent,
    FilterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({ ionMoonOutline, ionSunny }),
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    SkeletonComponent,
    ToolbarComponent,
    SearchbarComponent,
    FilterComponent,
  ],
})
export class SharedModule {}
