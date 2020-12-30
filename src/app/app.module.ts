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
// import { LayoutModule } from './layout/layout.module'
import { reducers, metaReducers } from './store/reducers';
import { RouteStoreExtModule } from './router_store_ext'
import { environment } from '../environments/environment';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ThemeSettingsComponent } from './containers/theme-settings/theme-settings.component';
import { TestSettingComponent } from './containers/test-setting/test-setting.component';
import { PageNotFoundComponent } from './components/not-found.component';
import { TestModuleModule } from './features/test-module/test-module.module';
// import { CoalescingComponentFactoryResolver } from './core/coalescing-component-factory-resolver.service';
import { CoreModule } from 'app/core/core.module';
import { AppLayoutComponent } from './containers/app-layout/app-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'
// https://github.com/angular/in-memory-web-api
import { InMemoryDataService } from './core/services/in-memory-data.service';
import { LoginComponent } from './containers/login/login.component'
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DashboardComponent,
    ThemeSettingsComponent,
    TestSettingComponent,
    AppLayoutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // enable animation functionality of some material components
    SharedModule,
    RoutingModule,
    // LayoutModule,
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
    HttpClientModule,

    !environment.production ? StoreDevtoolsModule.instrument() : [],

    // install a mocked api endpoint for dev
    !environment.production ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 }) : [],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(/*coalescingResolver: CoalescingComponentFactoryResolver*/) {
    // coalescingResolver.init();
  }
}
