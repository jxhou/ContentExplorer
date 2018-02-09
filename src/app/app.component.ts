import { Component, HostBinding, OnInit} from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromStore from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  selectedTheme$: Observable<string>;

  title = 'ContentExplorer';
  // Theme implementaion by binding/updating the host's class attribute.
  @HostBinding('class') classes;

  constructor(
    private store: Store<fromStore.State>,
  ) {}

  ngOnInit() {
    // Let's subscribe the theme state from the store
    this.selectedTheme$ = this.store.select(fromStore.getThemeName);
    this.selectedTheme$.subscribe(
      value => {
        // update the theme
        this.classes = value;
      }
    );
    // do a test
    //this.store.dispatch(new fromStore.SetThemeAction('purple-theme'));
  }
}

