import { Component } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: ``
})
export class PerfilComponent {
  usuario!: Usuario;
  edad: number = 0;

  imagenSubir!: File | null;
  imagenTemp!: string;

  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    private toastr: ToastrService,

  ) {
    this.usuario = this._usuarioService.usuario;
    this.edad = this._usuarioService.edad;
  }

  ngOnInit(): void {
    this.cargando = false;
  }

  guardar(usuario: Usuario) {
    this.usuario.identificacion = usuario.identificacion;
    this.usuario.name = usuario.name;
    this.usuario.username = usuario.username;
    this.usuario.email = usuario.email;
    this.usuario.fecha_nacimiento = usuario.fecha_nacimiento;
    this.usuario.telefono = usuario.telefono;
    this.usuario.direccion = usuario.direccion;

    this.cargando = true;
    this._usuarioService.actualizarUsuario(this.usuario)
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
          return EMPTY;
        })
      )
      .subscribe(resp => {
        this.cargando = false;
        console.log(resp);
      })
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

  cambiarImagen() {

    this._usuarioService.cambiarImagen(this.imagenSubir!, this.usuario.id);

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
