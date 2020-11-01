import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss']
})
export class ThemeSettingsComponent implements OnInit {
  theme: string;
  themes = [
    { value: 'deeppurple-theme', label: 'deeppurple-theme' },
    { value: 'indigo-theme', label: 'indigo-theme' },
    { value: 'pink-theme', label: 'pink-theme' },
    { value: 'purple-theme', label: 'purple-theme' }
  ];

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  onThemeSelect({ value }) {
    this.store.dispatch(new fromStore.SetThemeAction(value));
  }

}
