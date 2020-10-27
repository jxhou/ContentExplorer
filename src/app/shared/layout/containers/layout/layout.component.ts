import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { throwIfEmpty } from 'rxjs/operators';

// Dynamic contents:
// a. navBarLeftContent: ng-template instance, flush to left of the navigation bar
// b. navBarRightContent: ng-template instance, flush to right of the navigation bar
// c. navigation panel content: projected using ng-content (see in layout.component.html)
@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @Input()
  navBarLeftContent: TemplateRef<any>;

  @Input()
  navBarRightContent: TemplateRef<any>;

  @Input()
  title: string;
  
  opened: boolean;

  constructor() { 
    this.opened = true;
    this.title = 'test';
  }

  toggleSideBar() {
    this.opened = !this.opened
  }

  ngOnInit(): void {
  }

}
