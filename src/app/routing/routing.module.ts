import { NgModule } from '@angular/core';
import { RouterModule, provideRoutes, Routes  } from '@angular/router';

import { routes, SETTING_ROUTES } from './app.route';
// import { SettingsComponent, DashboardComponent } from '../containers';
// import { ThemeSettingsComponent } from '@app/components/theme-settings/theme-settings.component';
import { TestSettingComponent } from '@app/components/test-setting/test-setting.component';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [
    // Router
    RouterModule.forRoot(routes),
    SettingsModule.withRoutes(SETTING_ROUTES),
  ],
  exports: [
    RouterModule,
    SettingsModule
  ],
  // simply show how to configure routes using provideRoutes function, not necessary at all.
  // providers: [provideRoutes(SETTING_ROUTES)]
})
export class RoutingModule { }
