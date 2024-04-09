import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  constructor(
    public http: HttpClient,
    public router: Router) { }

  cargarSimulacros = () => {
    let url = URL_SERVICIOS + '/simulacros';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post(url, data);
  }

}
