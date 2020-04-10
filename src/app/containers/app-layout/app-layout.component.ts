import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from './../../store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, Routes } from '@angular/router';

interface Link {
  title: string,
  path: string
}

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {
  /*
  @Input()
  title: string;
  */
  private unsubscribe$: Subject<void> = new Subject<void>();
  routeStatus$: Observable<fromStore.fromRouterEx.RouteState>;
  title = 'ContentExplorer';
  sideBarRoutes: Link[] = [];
  toolBarRightRoutes: Link[] = [];
  
  constructor(private store: Store<fromStore.State & fromStore.fromRouterEx.State>, private router: Router) { 
    router.config.forEach((route) => {
      if (route.data && route.data.location === 'SideNav') {
        this.sideBarRoutes.push({title: route.data.title, path: route.path});
      } else if (route.data && route.data.location === 'ToolBarRight') {
        this.toolBarRightRoutes.push({title: route.data.title, path: route.path})
      }
    });
  }

  ngOnInit(): void {
    this.routeStatus$ = this.store.select(fromStore.fromRouterEx.getRouterState);
    // this.store.pipe(select(fromStore.fromRouterEx.selectRouterState));
    this.routeStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      value => {
        if (value) {
          // for some reason the custome state is wrapped inside of state property.
          const fullState: any = value;
          this.title = fullState.state.url;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
