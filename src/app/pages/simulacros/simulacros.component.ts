import { Component, OnInit } from '@angular/core';
import { Simulacro } from '../../models/simulacro.model';
import { SimulacroService } from '../../services/service.index';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-simulacros',
  templateUrl: './simulacros.component.html',
  styles: ``
})
export class SimulacrosComponent implements OnInit {

  simulacros: Simulacro[] = [];
  totalRegistros: number = 0;
  cargando: boolean = true;
  colores = ['#cc9000', '#15b869', '#f6c23e', '#6610f2', '#e74a3b', '#1cc88a', '#5a5c69', '#e74a3b'];
  coloresTarjetas: { [key: string]: string } = {};

  constructor(
    public _simulacroService: SimulacroService) { }

  ngOnInit(): void {
    this.cargarSimulacros();
  }

  cargarSimulacros() {
    this.cargando = true;

    this._simulacroService.cargarSimulacros()
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
        this.simulacros = resp.simulacros;
        this.cargando = false;
        this.inicializarColoresTarjetas();
      })
  }

  inicializarColoresTarjetas() {
    this.coloresTarjetas = {};
    this.simulacros.forEach((simulacro, index) => {
      this.coloresTarjetas[simulacro.id.toString()] = this.obtenerColorAleatorio();
    });
  }

  obtenerColorAleatorio(): string {
    const indice = Math.floor(Math.random() * this.colores.length);
    return this.colores[indice];
  }

}
