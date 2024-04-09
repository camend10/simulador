import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { EMPTY, catchError } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: ``
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  p: number = 1;

  cargando: boolean = true;

  constructor(public _usuarioService: UsuarioService,
    private toastr: ToastrService,
    public _modalUploadService: ModalUploadService) {
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this._modalUploadService.notificacion
      .subscribe(resp => this.cargarUsuarios());
  }

  mostrarModal(tipo: string, id: number, tipo_usu: string) {
    this._modalUploadService.mostrarModal(tipo, id, tipo_usu);
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios(this.desde)
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
        this.usuarios = resp.users;
        this.cargando = false;
      })
  }

  buscarUsuario(termino: string) {
    this.cargando = true;
    this._usuarioService.buscarUsuario(termino)
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
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      })
  }

  estadoUsuario(usuario: Usuario) {
    if (usuario.id === this._usuarioService.usuario.id) {
      this.toastr.error('No puede operar este usuario', 'No puede operar su mismo usuario', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      return;
    }

    let mensaje = '';
    let mensaje2 = '';
    if (usuario.estado === 1) {
      mensaje = 'Está a punto de eliminar a: ' + usuario.name;
      mensaje2 = 'Usuario: ' + usuario.name + ' eliminado correctamente ';
    } else {
      mensaje = 'Está a punto de activar a: ' + usuario.name;
      mensaje2 = 'Usuario: ' + usuario.name + ' activado correctamente ';
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
        this._usuarioService.borrarUsuario(usuario.id.toString(), usuario.estado!, mensaje2)
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
          .subscribe(
            (user: Usuario) => {
              usuario.estado = user.estado;
            }
          );
      }
    });
  }

  resetearClave(usuario: Usuario) {
    let mensaje = 'Está a punto de resetear la clave a: ' + usuario.name;

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
        this._usuarioService.resetearClave(usuario)
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
          .subscribe((user: Usuario) => {
            usuario.password = user.password;
            if (usuario.id === this._usuarioService.usuario.id) {
              setTimeout(() => {
                this._usuarioService.logout();
              }, 3000);
            }
          });
      }
    });
  }

}
