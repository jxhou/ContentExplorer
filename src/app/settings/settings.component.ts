import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  tabs: {label: string, link: string}[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    /*
    for (const child of activatedRoute.routeConfig.children) {
      if (child.path) {
      }
    }
    */
    this.tabs = activatedRoute.routeConfig.children.map(child => {
      return {label: child.data.title, link: child.path};
    });
  }

  ngOnInit() {
    for (const child of this.activatedRoute.routeConfig.children) {
      if (child.path) {
      }
    }
  }

}
