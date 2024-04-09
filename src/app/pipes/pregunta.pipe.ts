import { Pipe, PipeTransform } from '@angular/core';
import { URL_IMAGENES } from '../config/config';

@Pipe({
  name: 'pregunta'
})
export class PreguntaPipe implements PipeTransform {

  transform(imagen: string, id: string, materia_id: number): any {

    let url = URL_IMAGENES + "/imagenes/preguntas";
    return url += `/${materia_id}/` + `/${id}/` + imagen;

  }

}
