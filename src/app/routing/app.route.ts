import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent, DashboardComponent } from '../containers';
import { ThemeSettingsComponent } from '@app/components/theme-settings/theme-settings.component';
import { TestSettingComponent } from '@app/components/test-setting/test-setting.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
 /*
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
*/
];

// This extra routes can be merged in routes above.
// But just show another way to configure routes
export const SETTING_ROUTES: Routes =
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
        data: {
          title: 'theme'
        },
      },
      {
        path: 'test',
        component: TestSettingComponent,
        data: {
          title: 'test'
        },
      }
    ]
  }
]
