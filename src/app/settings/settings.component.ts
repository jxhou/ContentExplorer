import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';

export const SETTINGS_ROUTES = new InjectionToken<Routes>('settings.routes');

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  tabs: {label: string, link: string}[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, @Inject(SETTINGS_ROUTES) private settingRoutes: Routes[]) {
    // flatten array of Routes, and then dynamically add to current children
    activatedRoute.routeConfig.children = [].concat.apply([], settingRoutes);
    this.tabs = activatedRoute.routeConfig.children.map(child => {
      return {label: child.data.title, link: child.path};
    });
  }

  ngOnInit() {
  }

  // return trigger value, in case we need to animate differently between different routes
  prepRouteState(outlet: any) {
    return outlet.activatedRouteData['title'] || 'theme';
  }

}
