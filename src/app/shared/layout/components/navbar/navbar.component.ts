import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class AppNavBarComponent implements OnInit {
  @Input()
  leftContentTemplate: TemplateRef<any>;
/*
  @ViewChild('defaultTabButtons', {static: false} )
  private defaultTabButtonsTpl: TemplateRef<any>;
  */

  constructor() { }

  ngOnInit() {
  }

}
