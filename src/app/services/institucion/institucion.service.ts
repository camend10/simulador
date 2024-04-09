import { Injectable } from '@angular/core';
import { Institucion } from '../../models/institucion.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubirArchivoService, UsuarioService } from '../service.index';
import { URL_SERVICIOS } from '../../config/config';
import { catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {

  institucion!: Institucion;

  constructor(
    public http: HttpClient,
    public router: Router,
    private toastr: ToastrService,
    public _subirArchivoService: SubirArchivoService,
    public _usuariosService: UsuarioService
  ) { }

  cargarInstituciones() {

    let url = URL_SERVICIOS + '/instituciones';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post(url, data);
  }

  buscarInstitucion(termino: string) {
    let url = URL_SERVICIOS + '/instituciones';

    let data = {
      txtbusqueda: termino
    };

    return this.http.post(url, data)
      .pipe(
        map((resp: any) => resp.instituciones)
      );
  }

  borrarInstitucion(id: string, estado: number, mensaje: string) {
    let url = URL_SERVICIOS + '/instituciones/estado';

    let data = {
      id: id,
      estado: estado
    };

    return this.http.post(url, data)
      .pipe(
        map((resp: any) => {

          this.toastr.success(mensaje, 'Notificación', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            closeButton: true
          });
          return resp.institucion;
        })
      );
  }

  cargarInstitucion(id: string) {
    let url = URL_SERVICIOS + '/instituciones/by-id';

    let data = {
      id: id
    };

    return this.http.post(url, data)
      .pipe(
        map((resp: any) => {
          return resp.institucion;
        })
      );
  }

  guardarInstitucion(institucion: Institucion) {

    if (institucion.id) {
      // actualizando
      let url = URL_SERVICIOS + '/instituciones/modify/' + institucion.id;

      return this.http.put(url, institucion)
        .pipe(
          map((resp: any) => {
            this.toastr.success('Institución modificada ' + institucion.nombre + ' de manera exitosa', '!Exitoso', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              closeButton: true
            });
            return resp.institucion;
          })
        )

    } else {

      // creando
      let url = URL_SERVICIOS + '/instituciones/create';

      return this.http.post(url, institucion)
        .pipe(
          map((resp: any) => {

            this.toastr.success('Institución creada ' + institucion.nombre + ' de manera exitosa', '!Exitoso', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              closeButton: true
            });
            return resp.institucion;
          })
        )
    }

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
