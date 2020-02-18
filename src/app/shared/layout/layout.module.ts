import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule  } from '@angular/router';
import { AppNavBarComponent } from './components/navbar/navbar.component';
import { SharedMaterialModule } from '../shared-material.module';
import { LayoutComponent } from './containers/layout/layout.component'

@NgModule({
  imports: [
    SharedMaterialModule,
    CommonModule,
    RouterModule.forChild([])
  ],
  declarations: [AppNavBarComponent, LayoutComponent],
  exports: [AppNavBarComponent, LayoutComponent]
})
export class LayoutModule { }
