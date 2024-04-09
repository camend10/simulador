import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SimulacroService {

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  cargarSimulacros = () => {
    let url = URL_SERVICIOS + '/simulacros';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post(url, data);
  }

  cargarSesiones = () => {
    let url = URL_SERVICIOS + '/simulacros/sesiones';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post(url, data);
  }

  cargarMaterias = (id: number) => {
    let url = URL_SERVICIOS + '/simulacros/sesiones-materias';

    let data = {
      sesion_id: id
    };

    return this.http.post(url, data);
  }

  cargarPreguntas = (id: number, sesion_id: number) => {
    let url = URL_SERVICIOS + '/simulacros/preguntas';

    let data = {
      materia_id: id,
      sesion_id: sesion_id
    };

    return this.http.post(url, data);
  }

  guardarResultado(simulacro_id: number, sesion_id: number, materia_id: number, correctas: number, user_id: number) {
    let url = URL_SERVICIOS + '/simulacros/guardar-resultados';

    let data = {
      simulacro_id: simulacro_id,
      sesion_id: sesion_id,
      materia_id: materia_id,
      user_id: user_id,
      correctas: correctas
    };

    return this.http.post(url, data);
  }

  verificarPrueba(simulacro_id: number, sesion_id: number, materia_id: number, correctas: number, user_id: number) {
    let url = URL_SERVICIOS + '/simulacros/verificar-prueba';

    let data = {
      simulacro_id: simulacro_id,
      sesion_id: sesion_id,
      materia_id: materia_id,
      user_id: user_id,
      correctas: correctas
    };

    return this.http.post(url, data);
  }

  verificarSesion(simulacro_id: number, sesion_id: number, user_id: number) {
    let url = URL_SERVICIOS + '/simulacros/verificar-sesion';

    let data = {
      simulacro_id: simulacro_id,
      sesion_id: sesion_id,
      user_id: user_id
    };

    return this.http.post(url, data);
  }
}
