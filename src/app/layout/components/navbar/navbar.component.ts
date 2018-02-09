import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class AppNavBarComponent implements OnInit {
  @Input()
  leftContentTemplate: TemplateRef<any>;
  //logo = require('@app/assets/logo.png');
  constructor() { }

  ngOnInit() {
  }

}
