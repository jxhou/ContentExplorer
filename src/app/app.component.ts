import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '[class]' : 'theme',
  }
})
export class AppComponent {
  title = 'app';
  theme = 'pink-theme';
}
