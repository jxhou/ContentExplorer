import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../containers';
import { SettingsComponent } from '../settings/settings.component';
import { ThemeSettingsComponent } from '@app/components/theme-settings/theme-settings.component';
import { TestSettingComponent } from '@app/components/test-setting/test-setting.component';
import { PageNotFoundComponent } from '@app/components/not-found.component';
import { BarDialogComponent } from '../bar/dialog/dialog.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Settings'
    },
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
 {
   path: '',
   redirectTo: '/dashboard',
   pathMatch: 'full'
 },
 {
  path: 'bar',
  loadChildren: '../bar/bar.module#BarModule'
 },
 {
  path: 'barComp',
  component: PageNotFoundComponent
 },
 { path: '**', component: PageNotFoundComponent }
];

// This extra routes can be merged in routes above.
// But just show another way to configure routes
// This is route with full path used with option 1
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

// This extra routes can be merged in routes above.
// But just show another way to configure routes.
// Relative path without parent, can be used using router api, used in option 2
export const SETTING_CHILD_ROUTES: Routes =
[
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

