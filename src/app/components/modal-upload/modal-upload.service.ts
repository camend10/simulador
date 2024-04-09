import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {


  public tipo: string = '';
  public id: number = 0;
  public tipo_usu: string = '';

  public oculto: string = 'oculto';

  public notificacion = new EventEmitter<any>;

  constructor() { }

  ocultarModal() {
    this.oculto = 'oculto';
    this.tipo = '';
    this.id = 0;
  }

  mostrarModal(tipo: string, id: number, tipo_usu: string) {
    this.oculto = '';
    this.id = id;
    this.tipo = tipo;
    this.tipo_usu = tipo_usu;
  }
}
