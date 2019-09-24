import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyLoadedRoutingModule } from './lazy-loaded-routing.module';
import { MainComponent } from './main/main.component';
import { SettingComponent } from './setting/setting.component';
import { SettingHostService } from '../settings/setting-host.service';
import { CoalescingComponentFactoryResolver } from '../core/coalescing-component-factory-resolver.service';
import { setting } from './lazy-loaded-routing.module'

@NgModule({
  declarations: [MainComponent, SettingComponent],
  imports: [
    CommonModule,
    LazyLoadedRoutingModule
  ],
  entryComponents: [MainComponent, SettingComponent]
})
export class LazyLoadedModule { 
  constructor(
    coalescingResolver: CoalescingComponentFactoryResolver,
    localResolver: ComponentFactoryResolver,
    settingHostService:SettingHostService,
  ) {
    // coalescingResolver.registerResolver(localResolver);
    settingHostService.addSettingRoute(setting);
  }
}
