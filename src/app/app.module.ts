import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// in order to animation of material components, or use animation in your own components
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedModule } from  './shared/shared.module';
import { AppNavBarComponent } from './layout/components/app-nav-bar/app-nav-bar.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // enable animation functionality of some material components
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
