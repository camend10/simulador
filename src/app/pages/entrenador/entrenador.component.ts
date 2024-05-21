import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Pregunta } from '../../models/pregunta.model';
import { Router } from '@angular/router';
import { EntrenadorService, SimulacroService, UsuarioService } from '../../services/service.index';
import { Materia } from '../../models/materia.model';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entrenador',
  templateUrl: './entrenador.component.html',
  styles: ``
})
export class EntrenadorComponent implements OnInit, AfterViewInit {


  preguntas: Pregunta[] = [];
  materias: Materia[] = [];
  preguntaActual: number = 0;
  isQuizCompleto: boolean = false;
  suma: number = 0;

  cargando: boolean = true;

  materia_id: number = 0;
  materia: string = '';

  respuestaSeleccionada: string[] = [];
  respCorreptas: number[] = [];

  progreso1: string = '0';

  numpre: number = 5;
  empezar: boolean = false;

  colores = ['#cc9000', '#15b869', '#f6c23e', '#6610f2', '#e74a3b', '#1cc88a', '#5a5c69', '#e74a3b'];
  coloresTarjetas: { [key: string]: string } = {};

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService,
    public _entrenadorService: EntrenadorService,
    public _simulacroService: SimulacroService,
    private elementRef: ElementRef
  ) {
    this.numpre = 5;
    this.empezar = false;
    this.isQuizCompleto = false;
    this.preguntaActual = 0;
    this.cargando = false;

  }

  ngOnInit(): void {
    this.cargarMaterias();
  }

  ngAfterViewInit(): void {
    // Llamamos a la función para eliminar las clases 'active' después de que la vista se haya inicializado completamente
    this.removeActiveClasses();
  }

  removeActiveClasses(): void {
    // Obtener todos los elementos <label> dentro del contenedor
    const labels = this.elementRef.nativeElement.querySelectorAll('label');
    // Iterar sobre los elementos y eliminar la clase 'active' de cada uno
    labels.forEach((label: HTMLElement) => {
      label.classList.remove('active');
    });
  }

  cargarMaterias() {
    this.cargando = true;

    this._simulacroService.cargarMateriasEntrenador()
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

  btnEmpezar(id: number) {
    this.materia_id = id;
    this.empezar = true;
    this.cargarPreguntas();
    this.respuestaSeleccionada = new Array(this.preguntas.length).fill('');
  }

  nuevo() {
    this.numpre = 5;
    this.empezar = false;
    this.preguntaActual = 0;
    this.isQuizCompleto = false;
    this.respuestaSeleccionada = new Array(this.preguntas.length).fill('');
    this.preguntas = [];
    this.progreso1 = '0';
    this.materia = '';
  }

  cargarPreguntas() {
    this.cargando = true;

    this._simulacroService.cargarPreguntas2(this.materia_id, this.numpre)
      // this._simulacroService.cargarPreguntas2(this.materia_id, 2)
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

    if (this.preguntaActual < this.preguntas.length) {
      setTimeout(() => {
        this.preguntaActual++;
        this.removeActiveClasses();
        this.obtenerPorcentaje();
      }, 1000);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1200);
    }

    if ((this.preguntaActual + 1) === this.preguntas.length) {
      this.isQuizCompleto = true;
      this.suma = this.respCorreptas.reduce((total, actual) => total + actual, 0);
    }
  }

  isActive(respuesta: string): boolean {
    return this.respuestaSeleccionada[this.preguntaActual] === respuesta;
  }

  obtenerPorcentaje() {
    this.progreso1 = ((this.preguntaActual / this.preguntas.length) * 100).toFixed(2);
  }

  preguntaCor(correcta: number, i: number) {
    let corre: string = 'ans' + correcta;
    if (corre === 'ans1') {
      return this.preguntas[i].ans1;
    } else {
      if (corre === 'ans2') {
        return this.preguntas[i].ans2;
      } else {
        if (corre === 'ans3') {
          return this.preguntas[i].ans3;
        } else {
          return this.preguntas[i].ans4;
        }
      }
    }
  }

  banderaCor(correcta: number, i: number) {
    let corre: string = 'ans' + correcta;
    if (corre === 'ans1') {
      return this.preguntas[i].ban_imgr1;
    } else {
      if (corre === 'ans2') {
        return this.preguntas[i].ban_imgr2;
      } else {
        if (corre === 'ans3') {
          return this.preguntas[i].ban_imgr3;
        } else {
          return this.preguntas[i].ban_imgr4;
        }
      }
    }
  }

  imagenCor(correcta: number, i: number) {
    let corre: string = 'ans' + correcta;
    if (corre === 'ans1') {
      return this.preguntas[i].imgr1;
    } else {
      if (corre === 'ans2') {
        return this.preguntas[i].imgr2;
      } else {
        if (corre === 'ans3') {
          return this.preguntas[i].imgr3;
        } else {
          return this.preguntas[i].imgr4;
        }
      }
    }
  }

  idsCor(correcta: number, i: number) {
    return this.preguntas[i].id;
  }

  preguntaSel(seleccionada: string, i: number) {
    let dividida = seleccionada.split('_');
    if (dividida[1] === 'ans1') {
      return this.preguntas[i].ans1;
    } else {
      if (dividida[1] === 'ans2') {
        return this.preguntas[i].ans2;
      } else {
        if (dividida[1] === 'ans3') {
          return this.preguntas[i].ans3;
        } else {
          return this.preguntas[i].ans4;
        }
      }
    }
  }

  banderaSel(seleccionada: string, i: number) {
    let dividida = seleccionada.split('_');
    if (dividida[1] === 'ans1') {
      return this.preguntas[i].ban_imgr1;
    } else {
      if (dividida[1] === 'ans2') {
        return this.preguntas[i].ban_imgr2;
      } else {
        if (dividida[1] === 'ans3') {
          return this.preguntas[i].ban_imgr3;
        } else {
          return this.preguntas[i].ban_imgr4;
        }
      }
    }
  }

  imagenSel(seleccionada: string, i: number) {
    let dividida = seleccionada.split('_');
    if (dividida[1] === 'ans1') {
      return this.preguntas[i].imgr1;
    } else {
      if (dividida[1] === 'ans2') {
        return this.preguntas[i].imgr2;
      } else {
        if (dividida[1] === 'ans3') {
          return this.preguntas[i].imgr3;
        } else {
          return this.preguntas[i].imgr4;
        }
      }
    }
  }

  idsSel(seleccionada: string, i: number) {
    return this.preguntas[i].id;
  }

  condicion(seleccionada: string, correcta: number, i: number) {
    let corre: string = 'ans' + correcta;
    let dividida = seleccionada.split('_');

    if (corre === (dividida[1])) {
      return true;
    } else {
      return false;
    }
  }

}
