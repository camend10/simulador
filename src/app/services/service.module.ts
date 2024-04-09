import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedService, SidebarService, UsuarioService, SubirArchivoService, RoleService, GeneralService, InstitucionService, InterceptorService, SimulacroService, ResultadoService } from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SharedService,
    SidebarService,
    UsuarioService,
    SubirArchivoService,
    ModalUploadService,
    RoleService,
    GeneralService,
    InstitucionService,
    InterceptorService,
    SimulacroService,
    ResultadoService
  ]
})
export class ServiceModule { }
