import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, provideRoutes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared';
import { SettingsComponent } from './settings.component';

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
  static withRoutes(routes: Routes): ModuleWithProviders {
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
