/*
* This is an extension module for @ngrx/router-store to enable router states in current app.
* This module imports StoreRouterConnectingModule, registers router reducer with ngrx,
* define custom router state serializer, define router state selector, and common router actions
* of GO, BACK, and FORWARD.
*/
import { NgModule } from '@angular/core';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer,
  routerReducer,
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { CustomRouterStateSerializer, routerReducerName } from './store/reducers'

@NgModule({
  imports: [
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerializer
    }),
    StoreModule.forFeature(routerReducerName, routerReducer),
  ],
  providers: [/*{ provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }*/
  ],
  exports: [
  ]
})
export class RouteStoreExtModule { }
