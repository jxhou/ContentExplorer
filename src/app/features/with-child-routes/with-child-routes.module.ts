import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { Child1Component } from './main/child1/child1.component';
import { Child2Component } from './main/child2/child2.component';
import { SharedModule } from '@app/shared';

const routes: Routes = [
  {
    path: '', 
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'child1',
      },
      {
        path: 'child1',
        component: Child1Component,
      },
      {
        path: 'child2',
        component: Child2Component
      }
    ]
  }
]

@NgModule({
  declarations: [MainComponent, Child1Component, Child2Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class WithChildRoutesModule { }
