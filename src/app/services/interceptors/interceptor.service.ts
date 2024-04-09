import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UsuarioService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  token: string = '';
  _usuarioService: UsuarioService;
  constructor(_usuarioService: UsuarioService) {
    this._usuarioService = _usuarioService;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.endsWith('/login')) {
      // Si es una solicitud de inicio de sesión, no agregamos el encabezado de autorización
      return next.handle(req);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this._usuarioService.token}`
    });

    const reqClone = req.clone({
      headers
    });

    return next.handle(reqClone)
      .pipe(
        catchError(this.manejarError)
      );
  }

  manejarError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
