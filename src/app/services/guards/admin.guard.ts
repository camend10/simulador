import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../service.index';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {

  const _usuarioService = inject(UsuarioService);
  const router = inject(Router);

  if (_usuarioService.usuario.role_id === 1) {
    return true;
  } else {
    console.log("Bloqueado por el admin guard");
    router.navigate(['/dashboard']);
    return false;
  }


  return true;
};
