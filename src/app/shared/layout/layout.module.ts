import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule  } from '@angular/router';
import { AppNavBarComponent } from './components/navbar/navbar.component';
import { SharedMaterialModule } from '../shared-material.module'

@NgModule({
  imports: [
    SharedMaterialModule,
    CommonModule,
    RouterModule.forChild([])
  ],
  declarations: [AppNavBarComponent],
  exports: [AppNavBarComponent]
})
export class LayoutModule { }
