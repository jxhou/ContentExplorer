import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './settings.component';
import { Routes, provideRoutes } from '@angular/router';

@NgModule({
  imports: [
    CommonModule // we use ngFor
  ],
  exports: [
    SettingsComponent
  ],
  declarations: [],
  providers: []
})
export class SettingsModule {
  static withRoutes(routes: Routes) {
    return {
        ngModule: SettingsModule,
        providers: [
          provideRoutes(routes)
        ]
    }
  }

  constructor() {
  }
}
