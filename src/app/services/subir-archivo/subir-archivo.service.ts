import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo(archivo: File, tipo: string, id: number, tipo_usu: string, token: string) {

    return new Promise((resolve, reject) => {

      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append('archivo', archivo, archivo.name);
      formData.append('tipo', tipo_usu);
      formData.append('id', id.toString());

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(JSON.parse(xhr.response));
          }
        }
      }

      let url = "";

      if (tipo === "foto") {
        url = URL_SERVICIOS + "/users/upload?token=" + token;        
      } else {
        url = URL_SERVICIOS + "/instituciones/upload?token=" + token;
      }

      xhr.open('POST', url, true);
      xhr.send(formData);
    });


  }
}
