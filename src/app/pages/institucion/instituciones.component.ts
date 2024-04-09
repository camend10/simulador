import { Component } from '@angular/core';
import { Institucion } from '../../models/institucion.model';
import { InstitucionService } from '../../services/service.index';
import { ToastrService } from 'ngx-toastr';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styles: ``
})
export class InstitucionesComponent {
  instituciones: Institucion[] = [];
  totalRegistros: number = 0;
  p: number = 1;

  cargando: boolean = true;

  constructor(public _institucionService: InstitucionService,
    private toastr: ToastrService,
    public _modalUploadService: ModalUploadService) {
  }

  ngOnInit(): void {
    this.cargarInstituciones();

    this._modalUploadService.notificacion
      .subscribe(resp => this.cargarInstituciones());
  }

  mostrarModal(tipo: string, id: number, tipo_usu: string) {
    this._modalUploadService.mostrarModal(tipo, id, tipo_usu);
  }

  cargarInstituciones() {

    this.cargando = true;

    this._institucionService.cargarInstituciones()
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
        this.instituciones = resp.instituciones;
        this.cargando = false;
      })
  }

  buscarInstitucion(termino: string) {
    this.cargando = true;
    this._institucionService.buscarInstitucion(termino)
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
      .subscribe((instituciones: Institucion[]) => {
        this.instituciones = instituciones;
        this.cargando = false;
      })
  }

  estadoInstitucion(institucion: Institucion) {

    let mensaje = '';
    let mensaje2 = '';
    if (institucion.estado === 1) {
      mensaje = 'Está a punto de eliminar a la institución: ' + institucion.nombre;
      mensaje2 = 'Institución: ' + institucion.nombre + ' eliminada correctamente ';
    } else {
      mensaje = 'Está a punto de activar a la : ' + institucion.nombre;
      mensaje2 = 'Institución: ' + institucion.nombre + ' activada correctamente ';
    }

    Swal.fire({
      title: "¿Está seguro?",
      text: mensaje,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si!",
      cancelButtonText: "Cancelar!",
    }).then((result) => {

      if (result.isConfirmed) {
        this._institucionService.borrarInstitucion(institucion.id.toString(), institucion.estado!, mensaje2)
          .pipe(
            catchError(error => {
              console.log(error);
              Swal.fire({
                title: "Error!",
                text: error.error.error,
                icon: "error"
              });
              return EMPTY;
            })
          )
          .subscribe(
            (insti: Institucion) => {
              institucion.estado = insti.estado;
            }
          );
      }
    });
  }
}
