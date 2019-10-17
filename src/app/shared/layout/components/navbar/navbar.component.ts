import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class AppNavBarComponent implements OnInit {
  @Input()
  leftContentTemplate: TemplateRef<any>;

  @Input()
  rightContentTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
