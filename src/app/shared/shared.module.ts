import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedMaterialModule } from './shared-material.module';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from './layout/layout.module';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AlertComponent,
    PlaceholderDirective,
    LoadingSpinnerComponent,
  ],
  imports: [
    CommonModule,

    // Forms
    ReactiveFormsModule,
    FormsModule,

    // Material
    SharedMaterialModule,

    // Flex
    // FlexLayoutModule,

    LayoutModule
  ],
  providers: [
  ],
  exports:  [
    CommonModule, ReactiveFormsModule, FormsModule,
    // FlexLayoutModule,
    SharedMaterialModule, LayoutModule,
    AlertComponent, PlaceholderDirective, LoadingSpinnerComponent
   ]
})
export class SharedModule { }
