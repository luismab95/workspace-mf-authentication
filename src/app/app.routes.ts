import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('src/app/modules/authentication/authentication.routes'),
  },
];
