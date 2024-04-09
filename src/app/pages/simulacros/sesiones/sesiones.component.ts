import { Component } from '@angular/core';
import { Sesion } from '../../../models/sesion.model';
import { ActivatedRoute } from '@angular/router';
import { SimulacroService } from '../../../services/service.index';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.component.html',
  styles: ``
})
export class SesionesComponent {

  sesiones: Sesion[] = [];
  totalRegistros: number = 0;
  cargando: boolean = true;
  simulacro_id: number = 0;
  colores = ['#cc9000', '#15b869', '#f6c23e', '#6610f2', '#e74a3b', '#1cc88a', '#5a5c69', '#e74a3b'];
  coloresTarjetas: { [key: string]: string } = {};

  constructor(
    public activateRoute: ActivatedRoute,
    public _simulacroService: SimulacroService
  ) {
    activateRoute.params.subscribe(params => {
      let id = params['id'];
      this.cargando = false;
      this.simulacro_id = id;
      this.cargarSesiones();
    })
  }

  cargarSesiones() {
    this.cargando = true;

    this._simulacroService.cargarSesiones()
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.cargando = false;
          return EMPTY;
        })
      )
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.sesiones = resp.sesiones;
        this.cargando = false;
        this.inicializarColoresTarjetas();
      })
  }

  inicializarColoresTarjetas() {
    this.coloresTarjetas = {};
    this.sesiones.forEach((sesion, index) => {
      this.coloresTarjetas[sesion.id.toString()] = this.obtenerColorAleatorio();
    });
  }

  obtenerColorAleatorio(): string {
    const indice = Math.floor(Math.random() * this.colores.length);
    return this.colores[indice];
  }

}
