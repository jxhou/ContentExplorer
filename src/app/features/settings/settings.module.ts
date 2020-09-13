import { NgModule, ModuleWithProviders, Type, ANALYZE_FOR_ENTRY_COMPONENTS, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, provideRoutes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared';
import { SettingsComponent, SETTINGS_ROUTES } from './settings.component';
import { SettingHostService } from './setting-host.service'


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
  // Option 1.
  // We register the passed in routes using angular routeer's provideRoutes function, which is simple and easy.
  // provideRoutes() will declare entryComponents and add route configuration.
  // However this relies on the passed in routes with correct route path to target this setting page 
  // as its container. See more in src\app\routing\routing.module.ts. Option 2 solves this problem.
  static withRoutes(routes: Routes): ModuleWithProviders<SettingsModule> {
    return {
        ngModule: SettingsModule,
        providers: [
          provideRoutes(routes)
        ]
    }
  }

  // Option 2: a better way to register its child setting page.
  // Here we use ANALYZE_FOR_ENTRY_COMPONENTS to register entryComponents, and use a custom token 
  // SETTINGS_ROUTES to provide setting page components, which will be injected into SettingsComponent
  // as a dependency, and will be dynamically added as child routes using router api.
  // The difference here from Option 1 is that we dynamically add child routes ourself instead of 
  // registering routes using router's default ROUTES token.
  // Option 2: a better way to register its child setting page.
// Here we use ANALYZE_FOR_ENTRY_COMPONENTS to register entryComponents, and use a custom token 
// SETTINGS_ROUTES to provide setting page components, which will be injected into SettingsComponent
// as a dependency, and will be dynamically added as child routes using router api.
// The difference here from Option 1 is that we dynamically add child routes ourself instead of 
// registering routes using router's default ROUTES token.
static withSettingRoutes(routes: Routes): ModuleWithProviders<SettingsModule> {
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
    };
}

  constructor() {
  }
}
