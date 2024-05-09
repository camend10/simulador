import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-icfes';

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler(event: Event) {
  //   // Limpiar LocalStorage al cerrar el navegador
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('usuario');
  //   localStorage.removeItem('edad');
  //   localStorage.removeItem('menu');
  // }
  
}
