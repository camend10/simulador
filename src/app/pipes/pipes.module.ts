import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { TipoPerfilPipe } from './tipo-perfil.pipe';
import { EstadoPipe } from './estado.pipe';
import { PreguntaPipe } from './pregunta.pipe';



@NgModule({
  declarations: [
    ImagenPipe,
    TipoPerfilPipe,
    EstadoPipe,
    PreguntaPipe
  ],
  imports: [],
  exports: [
    ImagenPipe,
    TipoPerfilPipe,
    EstadoPipe,
    PreguntaPipe
  ]
})
export class PipesModule { }
