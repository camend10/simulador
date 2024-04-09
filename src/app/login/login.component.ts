import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

declare function init_plugins(): any;

const BODY_CLASSES = ['app-blank', 'bgi-size-cover', 'bgi-attachment-fixed', 'bgi-position-center', 'bgi-no-repeat'];
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit, OnDestroy {

  recuerdame: boolean = false;
  username: string = '';
  cargando: boolean = false;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) {

  }

  ngOnInit(): void {
    init_plugins();
    const bodyTag = document.body;
    bodyTag.classList.add('app-default');
    bodyTag.classList.remove('kt_app_body');
    BODY_CLASSES.forEach((c) => document.body.classList.add(c));
    bodyTag.style.backgroundImage = "url('assets/media/auth/bg10.jpeg')";

    this.username = localStorage.getItem('username') || '';
    if (this.username.length > 1) {
      this.recuerdame = true;
    }
  }

  ngOnDestroy() {
    BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
    const bodyTag = document.body;
    bodyTag.classList.remove('app-default');
    bodyTag.classList.add('kt_app_body');
    bodyTag.style.backgroundImage = "";
  }

  ingresar(forma: NgForm) {

    if (forma.invalid) {
      return;
    }

    let usuario = new Usuario(
      0,
      0,
      '',
      'null',
      '',
      forma.value.username,
      forma.value.password,
      0,
      0,
      0,
      0,
      0,
      'tipo_admin'
    );
    this.cargando = true;
    this._usuarioService.login(usuario, forma.value.recuerdame)
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
        setTimeout(() => {
          this.cargando = false;
          this.router.navigate(['/dashboard'])
        }, 3000);
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
}