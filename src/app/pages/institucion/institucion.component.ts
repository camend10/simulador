import { Component, OnInit } from '@angular/core';
import { Institucion } from '../../models/institucion.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departamento } from '../../models/departamento.model';
import { Municipio } from '../../models/municipio.model';
import { ToastrService } from 'ngx-toastr';
import { GeneralService, InstitucionService, UsuarioService } from '../../services/service.index';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styles: ``
})
export class InstitucionComponent implements OnInit {

  forma!: FormGroup;
  institucion: Institucion = new Institucion(0, '', '', '', '', 0, 0);

  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];

  cargando: boolean = true;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    public _usuarioService: UsuarioService,
    public _institucionService: InstitucionService,
    public router: Router,
    public activateRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService
  ) {
    activateRoute.params.subscribe(params => {
      let id = params['id'];
      this.cargando = false;
      if (id !== 'nuevo') {
        this.cargarInstitucion(id);
      }
    })
  }

  ngOnInit(): void {
    this.initForm();
    this.cargarDepartamentos();
    this.cargarMunicipios();

    this._modalUploadService.notificacion
      .subscribe(resp => {
        console.log(resp);
        this.institucion.foto = resp.institucion.foto;
        this.f['foto'].setValue(resp.institucion.foto);
      });
  }

  initForm() {
    this.forma = this.fb.group({
      id: [
        0
      ],
      codigo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ])
      ],
      nit: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ])
      ],
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
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
      foto: [
        ''
      ]
    });
  }

  cargarInstitucion(id: string) {
    this.cargando = true;
    this._institucionService.cargarInstitucion(id)
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.cargando = false;
          this.router.navigate(['/instituciones']);
          return EMPTY;
        })
      )
      .subscribe((institucion: Institucion) => {
        this.cargando = false;
        this.institucion = institucion;
        this.cargarData(this.institucion);
      });
  }

  cargarData = (institucion: Institucion) => {

    this.forma.reset({
      id: institucion.id,
      codigo: institucion.codigo,
      nit: institucion.nit,
      nombre: institucion.nombre,
      email: institucion.email,
      departamento_id: institucion.departamento_id,
      municipio_id: institucion.municipio_id,
      telefono: institucion.telefono,
      direccion: institucion.direccion,
      foto: institucion.foto
    });

    return Object.values(this.forma.controls).forEach(control => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(control => control.markAsTouched());
      } else {
        control.markAsTouched();
      }
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
          this.router.navigate(['/instituciones']);
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
          this.router.navigate(['/instituciones']);
          return EMPTY;
        })
      )
      .subscribe((municipios: Municipio[]) => {
        this.municipios = municipios;
      })
  }

  get f() {
    return this.forma.controls;
  }

  guardarInstitucion() {
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

    const result: any = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });

    this.institucion = {
      id: result['id'],
      codigo: result['codigo'],
      nit: result['nit'],
      nombre: result['nombre'],
      email: result['email'],
      departamento_id: result['departamento_id'],
      municipio_id: result['municipio_id'],
      telefono: result['telefono'],
      direccion: result['direccion'],
      estado: 1,
      user_id: 0,
      foto: result['foto']
    };

    this.cargando = true;
    this._institucionService.guardarInstitucion(this.institucion)
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
      .subscribe((institucion: Institucion) => {
        this.institucion.id = institucion.id;
        this.cargando = false;
        this.router.navigate(['/institucion', institucion.id]);
      });
  }

  mostrarMensaje(mensaje1: string) {
    this.toastr.error(mensaje1, 'Validación', {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true
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

  cambiarLogo() {
    this._modalUploadService.mostrarModal('institucion', this.institucion.id, 'instituciones');
  }
}
