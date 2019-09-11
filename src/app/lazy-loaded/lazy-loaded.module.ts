import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyLoadedRoutingModule } from './lazy-loaded-routing.module';
import { MainComponent } from './main/main.component';
import { SettingComponent } from './setting/setting.component';


@NgModule({
  declarations: [MainComponent, SettingComponent],
  imports: [
    CommonModule,
    LazyLoadedRoutingModule
  ],
  entryComponents: [MainComponent, SettingComponent]
})
export class LazyLoadedModule { }
