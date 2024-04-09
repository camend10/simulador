import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../service.index';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService implements OnInit {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService) { }

  ngOnInit(): void {

  }

  cargarRoles() {

    let url = URL_SERVICIOS + '/roles';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post(url, data)      
    .pipe(
      map((resp: any) => resp.roles)
    );
  }
}
