import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubirArchivoService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: ``
})
export class ModalUploadComponent implements OnInit {

  imagenSubir!: File | null;
  imagenTemp!: string;
  usuario!: Usuario;
  token: string = '';

  constructor(
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirArchivoService,
    private toastr: ToastrService,
    public _modalUploadService: ModalUploadService
  ) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit(): void {

  }

  seleccionImagen(event: Event) {
    const target = event.target as HTMLInputElement;
    const archivo: File = (target.files as FileList)[0];
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image')) {
      this.toastr.info('Solo imagenes', 'El archivo seleccionado no es una imagen', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      this.imagenTemp = reader.result as string;;
    }

  }

  subirImagen() {
    this._subirArchivoService.subirArchivo(
      this.imagenSubir!,
      this._modalUploadService.tipo,
      this._modalUploadService.id,
      this._modalUploadService.tipo_usu,
      this._usuarioService.token
    )
      .then(resp => {
        this._modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch(error => {
        this.cerrarModal();
        Swal.fire({
          title: "Error!",
          text: error.error,
          icon: "error"
        });
        return EMPTY;
      })
  }

  cerrarModal() {
    this.imagenTemp = '';
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();
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
