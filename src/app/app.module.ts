import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
} from '@ngrx/router-store';
// not used in production
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
// in order to animation of material components, or use animation in your own components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared';
import { RoutingModule } from './routing/routing.module';
import { LayoutModule } from './layout/layout.module'
import { reducers, metaReducers } from './store/reducers';
import { RouteStoreExtModule } from './router_store_ext'
import { environment } from '../environments/environment';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ThemeSettingsComponent } from './components/theme-settings/theme-settings.component';
import { TestSettingComponent } from './components/test-setting/test-setting.component';
import { PageNotFoundComponent } from './components/not-found.component';
import { TestModuleModule } from './test-module/test-module.module';
import { CoalescingComponentFactoryResolver } from './core/coalescing-component-factory-resolver.service';
import { CoreModule } from 'app/core/core.module';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DashboardComponent,
    ThemeSettingsComponent,
    TestSettingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // enable animation functionality of some material components
    SharedModule,
    RoutingModule,
    LayoutModule,
    TestModuleModule,
    CoreModule,
    /**
     * StoreModule.forRoot is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.forRoot(reducers, { metaReducers }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store.
     * RouteStoreExtModule wraps StoreRouterConnectingModule
     */
    // StoreRouterConnectingModule,
    RouteStoreExtModule,

    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(coalescingResolver: CoalescingComponentFactoryResolver) {
    // coalescingResolver.init();
  }
}
