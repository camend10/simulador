import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../models/role.model';
import { GeneralService, RoleService, UsuarioService } from '../../services/service.index';
import { Departamento } from '../../models/departamento.model';
import { Municipio } from '../../models/municipio.model';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoDocumento } from '../../models/tipodocumento.model';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

declare function funfecha(): any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: ``
})
export class UsuarioComponent implements OnInit {

  forma!: FormGroup;
  usuario: Usuario = new Usuario(0, 0, '', '', '', '', '', 0, 0, 0, 0, 0, '');

  roles: Role[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  tipodocumentos: TipoDocumento[] = [];

  cargando: boolean = true;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    public _roleService: RoleService,
    public _generalService: GeneralService,
    public _usuarioService: UsuarioService,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {
    
    activateRoute.params.subscribe(params => {
      let id = params['id'];
      this.cargando = false;
      if (id !== 'nuevo') {
        this.cargarUsuario(id);
      }
    })
  }

  ngOnInit(): void {
    funfecha();
    this.initForm();
    this.cargarTipoDocumentos();
    this.cargarRoles();
    this.cargarDepartamentos();
    this.cargarMunicipios();
    this.crearListeners();
  }

  initForm() {
    this.forma = this.fb.group({
      id: [
        0
      ],
      tipo_doc_id: [
        '',
        Validators.compose([
          Validators.required,
        ])
      ],
      identificacion: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.pattern(/^([0-9])*$/),
        ])
      ],
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ])
      ],
      genero: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      role_id: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      fecha_nacimiento: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(100),
          // Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
        ])
      ],
      departamento_id: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      municipio_id: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      telefono: [
        '',
        Validators.compose([
          Validators.pattern(/^([0-9])*$/),
        ])
      ],
      direccion: [
        ''
      ],
      jornada: [
        ''
      ],
      codigo: [
        ''
      ],
      grado_id: [
        ''
      ],
      curso_id: [
        ''
      ],
      foto: [
        ''
      ]
    });
  }

  get f() {
    return this.forma.controls;
  }

  guardarUsuario() {
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

    if (this.f['role_id'].value == 3) {
      if (this.f['jornada'].value == '' || this.f['jornada'].value == null) {
        this.mostrarMensaje('Por favor seleccione la jornada');
        return;
      }
      if (this.f['codigo'].value == '' || this.f['codigo'].value == null) {
        this.mostrarMensaje('Por favor digite el codigo');
        return;
      }
      if (this.f['grado_id'].value == '' || this.f['grado_id'].value == null) {
        this.mostrarMensaje('Por favor seleccione el grado');
        return;
      }
      if (this.f['curso_id'].value == '' || this.f['curso_id'].value == null) {
        this.mostrarMensaje('Por favor seleccione el curso');
        return;
      }
    }
    const result: any = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });

    this.usuario = {
      id: result['id'],
      tipo_doc_id: result['tipo_doc_id'],
      identificacion: result['identificacion'],
      name: result['name'],
      email: result['email'],
      username: result['identificacion'],
      password: result['identificacion'],
      curso_id: result['curso_id'],
      departamento_id: result['departamento_id'],
      municipio_id: result['municipio_id'],
      role_id: result['role_id'],
      grado_id: result['grado_id'],
      tipo: '',

      telefono: result['telefono'],
      direccion: result['direccion'],
      estado: 1,
      codigo: result['codigo'],
      jornada: result['jornada'],
      fecha_nacimiento: result['fecha_nacimiento'],
      user_id: 0,
      foto: result['foto'],
      genero: result['genero'],
    };

    this.cargando = true;
    this._usuarioService.guardarUsuario(this.usuario)
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
      .subscribe((usuario: Usuario) => {
        this.usuario.id = usuario.id;
        this.cargando = false;
        this.router.navigate(['/usuario', usuario.id]);
      });
  }

  cargarRoles() {
    this._roleService.cargarRoles()
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.cargando = false;
          this.router.navigate(['/usuarios']);
          return EMPTY;
        })
      )
      .subscribe((roles: Role[]) => {
        this.roles = roles;
      })
  }

  cargarDepartamentos() {
    this._generalService.cargarDepartamentos()
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.cargando = false;
          this.router.navigate(['/usuarios']);
          return EMPTY;
        })
      )
      .subscribe((departamentos: Departamento[]) => {
        this.departamentos = departamentos;
      })

  }

  cargarMunicipios() {
    this._generalService.cargarMunicipios()
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.cargando = false;
          this.router.navigate(['/usuarios']);
          return EMPTY;
        })
      )
      .subscribe((municipios: Municipio[]) => {
        this.municipios = municipios;
      })
  }

  cargarTipoDocumentos() {
    this._generalService.cargarTipoDocumentos()
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.cargando = false;
          this.router.navigate(['/usuarios']);
          return EMPTY;
        })
      )
      .subscribe((tipodocumentos: TipoDocumento[]) => {
        this.tipodocumentos = tipodocumentos;
      })
  }

  mostrarMensaje(mensaje1: string) {
    this.toastr.error(mensaje1, 'Validación', {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true
    });
  }

  crearListeners() {
    this.f['role_id'].valueChanges.subscribe(role => {
      if (role == 3) {
        this.f['jornada'].setValue('');
        this.f['codigo'].setValue('');
        this.f['grado_id'].setValue('');
        this.f['curso_id'].setValue('');
      }
    });
  }

  cargarUsuario(id: string) {
    this.cargando = true;
    this._usuarioService.cargarUsuario(id)
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.cargando = false;
          this.router.navigate(['/usuarios']);
          return EMPTY;
        })
      )
      .subscribe((usuario: Usuario) => {
        this.usuario = usuario;
        this.cargarData(this.usuario);
        this.cargando = false;
      });
  }

  cargarData = (usuario: Usuario) => {
    // this.forma.setValue({
    this.forma.reset({
      id: usuario.id,
      tipo_doc_id: usuario.tipo_doc_id,
      identificacion: usuario.identificacion,
      name: usuario.name,
      email: usuario.email,
      curso_id: usuario.curso_id,
      departamento_id: usuario.departamento_id,
      municipio_id: usuario.municipio_id,
      role_id: usuario.role_id,
      grado_id: usuario.grado_id,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      codigo: usuario.codigo,
      jornada: usuario.jornada,
      fecha_nacimiento: usuario.fecha_nacimiento,
      genero: usuario.genero,
      foto: usuario.foto
    });

    return Object.values(this.forma.controls).forEach(control => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(control => control.markAsTouched());
      } else {
        control.markAsTouched();
      }
    })

  }

  cambioMuni(evento: any) {
    // console.log(evento.target.value);
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
