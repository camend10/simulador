import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuardGuard } from './services/service.index';

const routes: Routes = [

  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuardGuard],
    loadChildren: () => import("./pages/pages.module").then((m) => m.PagesModule)
  },

  {
    path: 'login', component: LoginComponent, data: {
      titulo: 'Login',
      subtitulo: '',
      volver: ''
    }
  },
  { path: '**', component: NopagefoundComponent }

];

export const APP_ROUTES = RouterModule.forRoot(routes, { useHash: true });
