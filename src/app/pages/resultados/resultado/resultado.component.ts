import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultadoService, UsuarioService } from '../../../services/service.index';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { Usuario } from '../../../models/usuario.model';
import { Puntaje } from '../../../models/puntaje.model';
import { Institucion } from '../../../models/institucion.model';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.css'
})
export class ResultadoComponent {


  cargando: boolean = true;
  simulacro_id: number = 0;
  user_id: number = 0;
  usuario!: Usuario;
  grado: number = 0;
  curso: number = 0;
  global: number = 0;
  contador: number = 0;
  sobre1: number = 0;
  sobre2: number = 0;
  totalEstudiantes: number = 0;
  totalPreguntas: number = 0;
  puesto: number = 0;

  fecha: string = '';
  puntaje: Puntaje[] = [];
  institucion!: Institucion;
  infoCompleta: boolean = false;
  resComp: any[] = [];
  resComponentesMatematicas: any[] = [];
  resComponentesLenguaje: any[] = [];
  resComponentesSociales: any[] = [];
  resComponentesNaturales: any[] = [];
  resComponentesIngles: any[] = [];

  resCompetenciasMatematicas: any[] = [];
  resCompetenciasLenguaje: any[] = [];
  resCompetenciasSociales: any[] = [];
  resCompetenciasNaturales: any[] = [];
  resCompetenciasIngles: any[] = [];

  constructor(
    public activateRoute: ActivatedRoute,
    public router: Router,
    public _usuarioService: UsuarioService,
    public _resultadoService: ResultadoService
  ) {
    activateRoute.params.subscribe(params => {
      this.cargando = false;
      this.simulacro_id = params['simulacro_id'];
      this.user_id = this._usuarioService.usuario.id;

      this.verificarResultadoSesiones();
    })
  }


  verificarResultadoSesiones() {
    this.cargando = true;
    this._resultadoService.verificarResultadoSesiones(this.simulacro_id, this.user_id)
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
            this.router.navigate(['/resultados-simulacros']);
          }, 1000);
          return EMPTY;
        })
      )
      .subscribe((resp: any) => {
        this.cargando = false;
        if (!resp.resultado) {
          Swal.fire({
            title: "Verificando!",
            text: 'Debe realizar la pruba diagnóstica',
            icon: "info"
          });
          setTimeout(() => {
            this.router.navigate(['/resultados-simulacros']);
          }, 500);
        } else {
          this.usuario = resp.user;
          this.grado = resp.user.grado.sigla;
          this.curso = resp.user.curso.sigla;
          this.puntaje = resp.puntaje;

          console.log(this.puntaje[0].materia);
          console.log(this.puntaje[0].puntaje_total);
          this.infoCompleta = true;
          this.global = resp.global;
          this.contador = resp.contador;
          this.sobre1 = this.contador * 100;
          this.sobre2 = this.sobre1 / this.contador;
          this.fecha = resp.fecha;
          this.institucion = resp.institucion;
          this.totalEstudiantes = resp.totalEstudiantes;
          this.totalPreguntas = resp.totalPreguntas;
          this.puesto = resp.puesto;
          this.resComp = resp.resComp;
          this.resComponentesMatematicas = this.resComp['resComponentesMatematicas' as keyof typeof this.resComp];
          this.resComponentesLenguaje = this.resComp['resComponentesLenguaje' as keyof typeof this.resComp];
          this.resComponentesSociales = this.resComp['resComponentesSociales' as keyof typeof this.resComp];
          this.resComponentesNaturales = this.resComp['resComponentesNaturales' as keyof typeof this.resComp];
          this.resComponentesIngles = this.resComp['resComponentesIngles' as keyof typeof this.resComp]; 

          this.resCompetenciasMatematicas = this.resComp['resCompetenciasMatematicas' as keyof typeof this.resComp];
          this.resCompetenciasLenguaje = this.resComp['resCompetenciasLenguaje' as keyof typeof this.resComp];
          this.resCompetenciasSociales = this.resComp['resCompetenciasSociales' as keyof typeof this.resComp];
          this.resCompetenciasNaturales = this.resComp['resCompetenciasNaturales' as keyof typeof this.resComp];
          this.resCompetenciasIngles = this.resComp['resCompetenciasIngles' as keyof typeof this.resComp];          
        }
      });
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

  returnformateado(numero: string) {
    return parseFloat(numero);
  }
}
