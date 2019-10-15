import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedMaterialModule } from './shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,

    // Forms
    ReactiveFormsModule,
    FormsModule,

    // Material
    SharedMaterialModule,

    // Flex
    FlexLayoutModule,

    BrowserAnimationsModule,

    LayoutModule
  ],
  providers: [
  ],
  exports:  [
    CommonModule, ReactiveFormsModule, FormsModule,
    FlexLayoutModule, BrowserAnimationsModule,
    SharedMaterialModule, LayoutModule ]
})
export class SharedModule { }
