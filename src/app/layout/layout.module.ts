import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule  } from '@angular/router';
import { AppNavBarComponent } from './components/navbar/navbar.component';
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([])
  ],
  declarations: [AppNavBarComponent],
  exports: [AppNavBarComponent]
})
export class LayoutModule { }
