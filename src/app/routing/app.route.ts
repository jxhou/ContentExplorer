import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../containers';
import { SettingsComponent } from '../features/settings/settings.component';
import { ThemeSettingsComponent } from '@app/containers/theme-settings/theme-settings.component';
import { TestSettingComponent } from '@app/containers/test-setting/test-setting.component';
import { PageNotFoundComponent } from '@app/components/not-found.component';
// import { LazyLoadedModule } from '@app/features/lazy-loaded/lazy-loaded.module';
import { WithChildRoutesModule } from '@app/features/with-child-routes/with-child-routes.module';
import { TestModuleModule } from '@app/features/test-module/test-module.module';
import { SettingsModule } from '@app/features/settings/settings.module';
import { AuthComponent } from '@app/containers/auth/auth.component';
import { LoginComponent } from '@app/containers/login/login.component';

// data.location in route definition can have values of 'SideNav', 'ToolBarRight' etc, which configure the location,
// where the the link will be displayed.

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      location: 'SideNav',   // show up in side navigation bar.
      title: 'Dashboard'
    },
  },
  {
    // eagerly loading a module using lazy loading format
    // load the container for all setting's pages
    path: 'settings',
    // loadChildren: () => SettingsModule,
    component: SettingsComponent,
    data: {
      location: 'ToolBarRight', // show up in right of tool bar
      title: 'settings'  // mat-icon setting
    },
  },
  /* the old login page using template driven form
  {
    path: 'auth',
    component: AuthComponent,
    data: {
      location: 'ToolBarRight', // show up in right of tool bar
      title: 'account_circle' // mat-icon account 
    },
  },
  */
  {
    path: 'login',
    component: LoginComponent,
    data: {
      location: 'ToolBarRight', // show up in right of tool bar
      title: 'account_circle'
    },
  },
  {
    // eagerly loading a module using lazy loading format
    // load the container for all setting's pages
    path: 'test-module',
    loadChildren: () => TestModuleModule,
    data: {
      location: 'SideNav',
      title: 'TestModule'
    },
  },
  {
    path: 'lazy',
    loadChildren: () => import('../features/lazy-loaded/lazy-loaded.module').then(m => m.LazyLoadedModule),
    data: {
      location: 'SideNav',
      title: 'Lazy'
    },
  },
  {
    path: 'Not-found',
    component: PageNotFoundComponent,
    data: {
      location: 'SideNav',
      title: 'not found'
    },
  },
  {
    // eagerly load a module using the syntax of lazy-loading.
    path: 'eagerlyLoaded',
    loadChildren: () => WithChildRoutesModule,
    data: {
      location: 'SideNav',
      title: 'EagerlyLoaded',
      message: 'eagerly loaded using lazy loading style'
    },
  },
  { path: '**', redirectTo:'not-found' }
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

