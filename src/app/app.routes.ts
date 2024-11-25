import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((com) => com.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (com) => com.DashboardComponent
      ),
    canActivate: [AuthGuard], // Protect this route with the AuthGuard
  },
  {
    path: '',
    redirectTo: 'login', // Redirect to login by default
    pathMatch: 'full',
  },
  { 
    path: '**', 
    redirectTo: 'login', // Redirect any unknown route to login 
    pathMatch: 'full',
  },
];
