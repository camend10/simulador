import { Component } from '@angular/core';
import { Materia } from '../../../models/materia.model';
import { Sesion } from '../../../models/sesion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulacroService, UsuarioService } from '../../../services/service.index';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styles: ``
})
export class MateriasComponent {

  materias: any[] = [];

  cargando: boolean = true;
  simulacro_id: number = 0;
  sesion_id: number = 0;

  colores = ['#cc9000', '#15b869', '#f6c23e', '#6610f2', '#e74a3b', '#1cc88a', '#5a5c69', '#e74a3b'];
  coloresTarjetas: { [key: string]: string } = {};

  constructor(
    public activateRoute: ActivatedRoute,
    public router: Router,
    public _usuarioService: UsuarioService,
    public _simulacroService: SimulacroService
  ) {
    activateRoute.params.subscribe(params => {
      this.cargando = false;
      this.simulacro_id = params['simulacro_id'];
      this.sesion_id = params['sesion_id'];
      this.verificarSesion();
    })
  }

  verificarSesion() {
    let user_id = this._usuarioService.usuario.id;
    this.cargando = true;
    this._simulacroService.verificarSesion(this.simulacro_id, this.sesion_id, user_id)
      .pipe(
        catchError(error => {
          this.cargando = false;
          if (error.error.errors) {
            this.mostrarError(error.error.errors);
          } else {
            Swal.fire({
              title: "Error!",
              text: error.error.error,
              icon: "error"
            });
          }
          setTimeout(() => {
            this.router.navigate(['/sesiones', this.simulacro_id]);
          }, 1000);
          return EMPTY;
        })
      )
      .subscribe((resp: any) => {
        this.cargando = false;
        if (resp.resultado >= resp.totalMaterias) {
          Swal.fire({
            title: "Verificando!",
            text: 'La sesión ya se encuentra realizada',
            icon: "info"
          });
          setTimeout(() => {
            this.router.navigate(['/sesiones', this.simulacro_id]);
          }, 500);
        } else {
          this.cargarMaterias();
        }
      });
  }


  cargarMaterias() {
    this.cargando = true;

    this._simulacroService.cargarMaterias(this.sesion_id)
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
        this.materias = resp.materias;
        
        this.cargando = false;
        this.inicializarColoresTarjetas();
      })
  }

  inicializarColoresTarjetas() {
    this.coloresTarjetas = {};
    this.materias.forEach((materia, index) => {
      this.coloresTarjetas[materia.id.toString()] = this.obtenerColorAleatorio();
    });
  }

  obtenerColorAleatorio(): string {
    const indice = Math.floor(Math.random() * this.colores.length);
    return this.colores[indice];
  }

  mostrarError(errors: any) {
    let errorMessage = '';
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errorMessage += `${key}: ${errors[key]}<br>`;
      }
    }
    Swal.fire({
      icon: 'error',
      title: 'Error',
      html: errorMessage
    });
  }

}
