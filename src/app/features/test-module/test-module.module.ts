import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

import { SettingsModule } from '../settings/settings.module';
import { TestModuleSettingComponent } from './test-module-setting/test-module-setting.component';


const routes: Routes = [
  {
    path: 'TestModuleSetting',
    component: TestModuleSettingComponent,
    data: {
      title: 'TestModuleSetting'
    },
  },
]
@NgModule({
  imports: [
    CommonModule,
    // Here we register this module's setting page with SettingsModule, which results in the setting page 
    // (TestModuleSettingComponent) automatically surfaces in settings container.
    SettingsModule.withSettingRoutes(routes),
  ],
  declarations: [TestModuleSettingComponent]
})
export class TestModuleModule { }
