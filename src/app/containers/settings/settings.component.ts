import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  tabs: {label: string, link: string}[] =
  [{label: 'theme', link: 'theme'},
  {label: 'test', link: 'test'}];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    for (const child of activatedRoute.routeConfig.children) {
      if (child.path) {
      }
    }
  }

  ngOnInit() {
    for (const child of this.activatedRoute.routeConfig.children) {
      if (child.path) {
      }
    }
  }

}
