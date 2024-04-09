import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { filter, map, retry } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: ``
})
export class RxjsComponent implements OnDestroy {

  subscripcion!: Subscription;

  constructor() {

    this.subscripcion = this.regresaObservable()
      .subscribe(
        numero => console.log("Subs: ", numero),
        error => console.error("Error en el obs: ", error),
        () => console.log("El observador terminó")
      );

  }

  ngOnDestroy(): void {
    console.log("la pagina se va a cerrar");
    this.subscripcion.unsubscribe();
  }


  regresaObservable(): Observable<any> {

    return new Observable((observer: Subscriber<any>) => {

      let contador = 0;

      let intervalo = setInterval(() => {

        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
        // if (contador === 2) {
        //   // clearInterval(intervalo);
        //   observer.error("Auxilio");
        // }

      }, 1000);

    }).pipe(

      map(resp => resp.valor),
      filter((valor, index) => {
        if ((valor % 2) === 1) {
          //impar
          return true;
        } else {
          //par
          return false;
        }
      })

    )

  }

}
