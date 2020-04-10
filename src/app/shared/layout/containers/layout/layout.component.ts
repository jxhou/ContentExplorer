import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { throwIfEmpty } from 'rxjs/operators';

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
    this.opened = false;
    this.title = 'test';
  }

  toggleSideBar() {
    this.opened = !this.opened
  }

  ngOnInit(): void {
  }

}
