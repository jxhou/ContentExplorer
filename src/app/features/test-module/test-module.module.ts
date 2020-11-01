import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SettingsModule } from '../settings/settings.module';
import { TestModuleSettingComponent } from './test-module-setting/test-module-setting.component';
import { MainComponent } from './main/main.component';

const childRoutesToSettings: Routes = [
  {
    path: 'TestModuleSetting',
    component: TestModuleSettingComponent,
    data: {
      title: 'TestModuleSetting'
    },
  },
];

const routRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      title: 'TestModule'
    },
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routRoutes),
  ],
  declarations: [TestModuleSettingComponent, MainComponent],
  // Here we register this module's setting page with SETTINGS_ROUTES_TOKEN, which will be picked up by
  // settings container.
  providers: [
    SettingsModule.registerRoutesProvider(childRoutesToSettings),
  ]
})
export class TestModuleModule { }
