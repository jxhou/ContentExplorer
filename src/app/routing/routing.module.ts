import { NgModule } from '@angular/core';
import { RouterModule, provideRoutes, Routes  } from '@angular/router';

import { routes } from './app.route';
import { SettingsComponent, DashboardComponent } from '../containers';
import { ThemeSettingsComponent } from '@app/components/theme-settings/theme-settings.component';
import { TestSettingComponent } from '@app/components/test-setting/test-setting.component';


const EXTRA_ROUTES: Routes =
[
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Settings'
    },
    children: [
      {
        path: 'theme',
        component: ThemeSettingsComponent,
      },
      {
        path: 'test',
        component: TestSettingComponent,
      }
    ]
  }
]

@NgModule({
  imports: [
    // Router
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [provideRoutes(EXTRA_ROUTES)]
})
export class RoutingModule { }
