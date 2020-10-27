import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SettingComponent } from './setting/setting.component';

// The route to be registered to SettingComponent's router-outlet
export const setting: Routes = [
  {
    path: 'SettingComponent',
    component: SettingComponent,
    data: {
      title: 'lazySetting'
    },
  },
];

// routes to be appended to the root of parent routing tree
const routes: Routes = [{
    path: '',
    component: MainComponent,
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyLoadedRoutingModule { }
