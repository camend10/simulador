import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../services/service.index';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar',
  templateUrl: './cambiar.component.html',
  styles: ``
})
export class CambiarComponent implements OnInit {

  forma!: FormGroup;
  usuario: Usuario = new Usuario(0, 0, '', '', '', '', '', 0, 0, 0, 0, 0, '');

  cargando: boolean = true;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    public _usuarioService: UsuarioService,
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.cargando = false;
  }

  get f() {
    return this.forma.controls;
  }

  sonIguales(campo1: string, campo2: string) {

    return (group: FormGroup) => {

      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        sonIguales: true
      };

    }
  }

  initForm() {
    this.forma = this.fb.group({
      passwordAct: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30)
        ])
      ],
      passwordNue: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30)
        ])
      ],
      passwordRep: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30)
        ])
      ]
    }, { validators: this.sonIguales('passwordNue', 'passwordRep') });
  }

  guardar() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      })
      return;
    }

    this.cargando = true;
    this._usuarioService.cambiarClave(this._usuarioService.usuario.id.toString(),
      this.f['passwordAct'].value,
      this.f['passwordNue'].value,
      this.f['passwordRep'].value)

      .pipe(
        catchError(error => {
          this.cargando = false;
          if (error.error.ok === false) {
            Swal.fire({
              title: "Error!",
              text: error.error.error,
              icon: "error"
            });
          } else {
            this.mostrarError(error.error.error);
          }
          return EMPTY;
        })
      )
      .subscribe((resp: boolean) => {

        this.cargando = false;
        if (resp) {
          setTimeout(() => {
            this._usuarioService.logout();
          }, 3000);
        }
      });
  }

  cancelar = () => {
    this.forma.setValue({
      passwordAct: '',
      passwordNue: '',
      passwordRep: '',
    })
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
