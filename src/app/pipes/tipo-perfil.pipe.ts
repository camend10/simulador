import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoPerfil'
})
export class TipoPerfilPipe implements PipeTransform {

  transform(tipo: string = "tipo_usuario"): unknown {

    let tipoPerfil = "";

    switch (tipo) {
      case 'tipo_usuario':
        tipoPerfil = "Usuario";
        break;
      case 'tipo_docente':
        tipoPerfil = "Docente";
        break;
      case 'tipo_estudiante':
        tipoPerfil = "Estudiante";
        break;
      case 'tipo_admin':
        tipoPerfil = "Administrador";
        break;
      default:
        tipoPerfil = "Administrador";
    }

    return tipoPerfil;
  }

}
