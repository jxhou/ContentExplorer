import { Component, HostBinding, OnInit, OnDestroy} from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Observable ,  Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as fromStore from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  selectedTheme$: Observable<string>;
  title = 'ContentExplorer';
  lastTheme = '';
  // Theme implementation by binding/updating the host's class attribute.
  @HostBinding('class') classes;

  constructor(
    public overlayContainer: OverlayContainer,
    private store: Store<fromStore.State>,
  ) {}

  ngOnInit() {
    // Let's subscribe the theme state from the store
    this.selectedTheme$ = this.store.select(fromStore.getThemeName);
    this.selectedTheme$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      value => {
        // update the theme
        this.classes = value;
        const classList = this.overlayContainer.getContainerElement().classList;
        if (this.lastTheme) {
          classList.remove(this.lastTheme);
        }
        classList.add(value);
        this.lastTheme = value;
      }
    );
    this.title = 'test title 3';
    // do a test
    // this.store.dispatch(new fromStore.SetThemeAction('purple-theme'));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

