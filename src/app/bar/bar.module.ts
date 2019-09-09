import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarRoutingModule } from './bar-routing.module';
import { MainComponent } from './main/main.component';
import { BarDialogComponent } from './dialog/dialog.component';
import { CoalescingComponentFactoryResolver } from '../core/coalescing-component-factory-resolver.service';
import { SettingHostService } from '../settings/setting-host.service';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'BarDialogComponent',
    component: BarDialogComponent,
    data: {
      title: 'BarDialogComponent'
    },
  },
];

@NgModule({
  declarations: [MainComponent, BarDialogComponent],
  entryComponents: [BarDialogComponent],
  imports: [CommonModule, BarRoutingModule]
})
export class BarModule {
  constructor(
    coalescingResolver: CoalescingComponentFactoryResolver,
    localResolver: ComponentFactoryResolver,
    settingHostService:SettingHostService,
  ) {
    coalescingResolver.registerResolver(localResolver);
    settingHostService.addSettingRoute(routes);
  }
}
