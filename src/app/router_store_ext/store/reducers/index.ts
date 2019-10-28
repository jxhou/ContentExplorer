import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params,
} from '@angular/router';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import { Injectable } from "@angular/core";
import * as fromRoot from '@app/store';

// define a reducer name for router state
export const routerReducerName = 'routerReducer';

// Custom router state
export interface RouteState {
  url: string;
  queryParams: Params;
  params: Params;
}
export interface State  extends fromRoot.State {
  [routerReducerName]: RouteState;
}

/*
export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouteState>
>(routerReducerName);
*/

export const getRouterState = createFeatureSelector<State, RouteState>(
  routerReducerName
);

export const selectRouterState = createSelector(
  getRouterState,
  (state: RouteState) => state
);
/**
 * The RouterStateSerializer takes the current RouterStateSnapshot
 * and returns any pertinent information needed. The snapshot contains
 * all information about the state of the router at the given point in time.
 * The entire snapshot is complex and not always needed. In this case, you only
 * need the URL and query parameters from the snapshot in the store. Other items could be
 * returned such as route parameters and static route data.
 */
@Injectable()
export class CustomRouterStateSerializer
  implements fromRouter.RouterStateSerializer<RouteState> {
  serialize(routerState: RouterStateSnapshot): RouteState {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params };
  }
}
