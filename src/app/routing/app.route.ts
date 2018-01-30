import { Routes, RouterModule }  from '@angular/router';
import { SettingsComponent, DashboardComponent } from '../containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Settings'
    }
  }
  /*
  {
    path: 'my-questions',
    loadChildren: 'app/myQuestions/my-questions.module#MyQuestionsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'game-play',
    loadChildren: 'app/game-play/game-play.module#GamePlayModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  }*/
];
