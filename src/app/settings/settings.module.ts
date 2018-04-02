import { NgModule, ModuleWithProviders, Type, ANALYZE_FOR_ENTRY_COMPONENTS, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, provideRoutes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared';
import { SettingsComponent } from './settings.component';

export const SETTINGS_ROUTES = new InjectionToken<Routes>('settings.routes');

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    SharedModule,
    RouterModule,
  ],
  exports: [
    SettingsComponent
  ],
  providers: []
})
export class SettingsModule {
  static withRoutes(routes: Routes): ModuleWithProviders {
    return {
        ngModule: SettingsModule,
        providers: [
          provideRoutes(routes)
        ]
    }
  }

  static withSettingRoutes(routes: Routes) {
    return {
      ngModule: SettingsModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: routes, multi: true
        },
        {
          provide: SETTINGS_ROUTES,
          useValue: routes, multi: true
        },
      ]
    }
  }

  constructor() {
  }
}
