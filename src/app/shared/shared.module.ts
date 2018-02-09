import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedMaterialModule } from './shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,

    // Forms
    ReactiveFormsModule, 

    //Material
    SharedMaterialModule,

    //Flex
    FlexLayoutModule,

    BrowserAnimationsModule

  ],
  providers: [ 
  ],                                                                      
  exports:  [
              CommonModule, ReactiveFormsModule,
              FlexLayoutModule, BrowserAnimationsModule,
              SharedMaterialModule ]
})
export class SharedModule { }
