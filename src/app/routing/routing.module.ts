import { NgModule } from '@angular/core';
import { RouterModule, provideRoutes, Routes, PreloadAllModules  } from '@angular/router';

import { routes, SETTING_ROUTES, SETTING_CHILD_ROUTES } from './app.route';
// import { SettingsComponent, DashboardComponent } from '../containers';
// import { ThemeSettingsComponent } from '@app/components/theme-settings/theme-settings.component';
import { TestSettingComponent } from '@app/containers/test-setting/test-setting.component';
import { SettingsModule } from '../features/settings/settings.module';

@NgModule({
  imports: [
    // Router: any other routes have to go before RouterModule.forRoot(routes). Otherwise wild card route will match.
    /*
    // Option 1, still ask SettingsModule to register its child routes. But here SETTING_ROUTES as defined 
    // in app.route.ts specifies the full path from settings page to its children exposed by the app module.
    // Internally SettingsModule.withRoutes will call the standard provideRoutes() implementation to 
    // register the passed in route configuration, which should be full route path, and also declare 
    // entryComponent for dynamic instantiation at same time.
    // However it does not feel right for this module to know the settings page's route. The option 2 seems better.
    SettingsModule.withRoutes(SETTING_ROUTES),
    */

    // Option 2:
    // Also ask SettingsModule to register its child route page.
    // Here SETTING_CHILD_ROUTES as defined in app.route.ts list only the components 
    // (ThemeSettingsComponent and TestSettingComponent)
    // to be added to the settings page, without knowledge of the route path for the settings page.
    // Internally SettingsModule.withSettingRoutes will declare all the setting components as entryComponents 
    // using ANALYZE_FOR_ENTRY_COMPONENTS, also allow settings page to dynamically add the setting components
    // as child routes under settings page container using route api.
    SettingsModule.withSettingRoutes(SETTING_CHILD_ROUTES),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [
    RouterModule,
    SettingsModule
  ],
  // simply show how to configure routes using provideRoutes function, not necessary at all.
  // providers: [provideRoutes(SETTING_ROUTES)]
})
export class RoutingModule { }
