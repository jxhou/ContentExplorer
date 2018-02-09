import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  tabs: {label: string, link: string}[] =
  [{label: 'theme', link: 'theme'},
  {label: 'test', link: 'test'}];

  constructor() { }

  ngOnInit() {
  }

}
