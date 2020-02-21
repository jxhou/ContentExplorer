import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @Input()
  navBarLeftContent: TemplateRef<any>;

  @Input()
  navBarRightContent: TemplateRef<any>;
  
  opened: boolean;
  title: string;

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
