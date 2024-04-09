import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado'
})
export class EstadoPipe implements PipeTransform {

  transform(estado: number = 1): unknown {

    if (estado === 1) {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

}
