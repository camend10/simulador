import { Component, OnInit } from '@angular/core';
import { Pregunta } from '../../../models/pregunta.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulacroService, UsuarioService } from '../../../services/service.index';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styles: ``
})
export class PreguntasComponent implements OnInit {

  preguntas: Pregunta[] = [];
  preguntaActual: number = 0;
  isQuizCompleto: boolean = false;

  cargando: boolean = true;
  simulacro_id: number = 0;
  sesion_id: number = 0;
  materia_id: number = 0;
  materia: string = '';
  numeros: number[] = [];

  respuestaSeleccionada: string[] = [];
  respCorreptas: number[] = [];
  preguntasVisitadas: boolean[] = new Array(this.preguntas.length).fill(false);


  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;

  progreso1: string = '0';

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService,
    public activateRoute: ActivatedRoute,
    public _simulacroService: SimulacroService
  ) {
    activateRoute.params.subscribe(params => {
      this.cargando = false;
      this.simulacro_id = params['simulacro_id'];
      this.sesion_id = params['sesion_id'];
      this.materia_id = params['materia_id'];

      this.verificarPrueba();
    })
  }

  ngOnInit(): void {
    setInterval(() => {
      this.incrementarSegundos();
    }, 1000);
  }

  verificarPrueba() {
    let user_id = this._usuarioService.usuario.id;
    this.cargando = true;
    this._simulacroService.verificarPrueba(this.simulacro_id, this.sesion_id, this.materia_id, 0, user_id)
      .pipe(
        catchError(error => {
          this.cargando = false;
          this.isQuizCompleto = false;
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
            this.router.navigate(['/materias', this.simulacro_id, this.sesion_id]);
          }, 1000);
          return EMPTY;
        })
      )
      .subscribe((resp: any) => {
        this.cargando = false;
        if (resp.resultado > 0) {
          this.isQuizCompleto = true;
          Swal.fire({
            title: "Verificando!",
            text: 'La prueba ya se encuentra realizada',
            icon: "success"
          });
          setTimeout(() => {
            this.router.navigate(['/materias', this.simulacro_id, this.sesion_id]);
          }, 500);
        } else {
          this.cargarPreguntas();
          // Inicializar respuestaSeleccionada con valores predeterminados
          this.respuestaSeleccionada = new Array(this.preguntas.length).fill('');
        }
      });
  }

  cargarPreguntas() {
    this.cargando = true;

    this._simulacroService.cargarPreguntas(this.materia_id, this.sesion_id)
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
        this.preguntas = resp.preguntas;
        this.materia = resp.materia;
        if (this.respuestaSeleccionada.length !== this.preguntas.length) {
          this.respuestaSeleccionada = new Array(this.preguntas.length).fill('');
        }
        for (let i = 0; i < this.preguntas.length; i++) {
          this.numeros.push(i);
        }
        this.cargando = false;
      })
  }

  getCurrentPregunta() {
    if (this.preguntas && this.preguntas.length > this.preguntaActual) {
      return this.preguntas[this.preguntaActual];
    } else {
      return null; // o maneja el caso donde preguntaActual está fuera de rango
    }
  }

  toggleActive(respuesta: string, actual: number, opcion: string) {
    this.respuestaSeleccionada[this.preguntaActual] = respuesta;

    let correcta = this.preguntas[actual].true_ans;
    let escojida = 'ans' + correcta;
    if (opcion === escojida) {
      this.respCorreptas[this.preguntaActual] = 1;
    } else {
      this.respCorreptas[this.preguntaActual] = 0;
    }
  }

  isActive(respuesta: string): boolean {
    return this.respuestaSeleccionada[this.preguntaActual] === respuesta;
  }

  incrementarSegundos() {
    this.segundos++;
    if (this.segundos === 60) {
      this.segundos = 0;
      this.incrementarMinutos();
    }
  }

  incrementarMinutos() {
    this.minutos++;
    if (this.minutos === 60) {
      this.minutos = 0;
      this.incrementarHoras();
    }
  }

  incrementarHoras() {
    this.horas++;
  }

  siguientePregunta() {
    if (this.preguntaActual < this.preguntas.length) {
      this.preguntaActual++;
      this.obtenerPorcentaje();
      // Reiniciar la respuesta seleccionada al pasar a la siguiente pregunta
      // this.respuestaSeleccionada[this.preguntaActual] = '';
    }
    if ((this.preguntaActual) === this.preguntas.length) {
      let suma: number = this.respCorreptas.reduce((total, actual) => total + actual, 0);
      let user_id = this._usuarioService.usuario.id;
      this.cargando = true;
      this._simulacroService.guardarResultado(this.simulacro_id, this.sesion_id, this.materia_id, suma, user_id)
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
              this.router.navigate(['/materias', this.simulacro_id, this.sesion_id]);
            }, 1000);
            return EMPTY;
          })
        )
        .subscribe(resp => {
          this.cargando = false;
          this.isQuizCompleto = true;
          Swal.fire({
            title: "Felicitaciones!",
            text: 'Has completado la prueba de ' + this.materia,
            icon: "success"
          });
          setTimeout(() => {
            this.router.navigate(['/materias', this.simulacro_id, this.sesion_id]);
          }, 1000);
        });
    }
  }

  anteriorPregunta() {
    if (this.preguntaActual > 0) {
      this.preguntaActual--;
      // Reiniciar la respuesta seleccionada al volver a la pregunta anterior
      // this.respuestaSeleccionada[this.preguntaActual] = '';
    }
  }

  tieneRespuestaSeleccionada(): boolean {
    return this.respuestaSeleccionada[this.preguntaActual] !== '';
  }

  obtenerPorcentaje() {
    this.progreso1 = ((this.preguntaActual / this.preguntas.length) * 100).toFixed(2);
  }

  seleccionarPagina(pagina: number) {
    this.preguntaActual = pagina;
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
