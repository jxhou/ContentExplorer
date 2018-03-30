import { NgModule } from '@angular/core';
import { RouterModule, provideRoutes, Routes  } from '@angular/router';

import { routes, SETTING_ROUTES } from './app.route';
// import { SettingsComponent, DashboardComponent } from '../containers';
// import { ThemeSettingsComponent } from '@app/components/theme-settings/theme-settings.component';
import { TestSettingComponent } from '@app/components/test-setting/test-setting.component';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [
    // Router: any other routes have to go before RouterModule.forRoot(routes). Otherwise wiild card route will match.
    SettingsModule.withRoutes(SETTING_ROUTES),
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
    SettingsModule
  ],
  // simply show how to configure routes using provideRoutes function, not necessary at all.
  // providers: [provideRoutes(SETTING_ROUTES)]
})
export class RoutingModule { }
