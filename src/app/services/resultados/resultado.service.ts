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

  verificarResultadoSesiones(simulacro_id: number, user_id: number) {
    let url = URL_SERVICIOS + '/simulacros/verificar-resultado-sesiones';

    let data = {
      simulacro_id: simulacro_id,
      user_id: user_id
    };

    return this.http.post(url, data);
  }

}
