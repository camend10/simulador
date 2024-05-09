import { Component, OnInit } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: ``
})
export class BreadcrumbsComponent implements OnInit {

  titulo: string = '';
  subtitulo: string = '';
  volver: string = '';

  constructor(private router: Router,
    private title: Title,
    private meta: Meta) {

    this.getDataRoute()
      .subscribe(data => {
        this.titulo = data['titulo'];
        this.subtitulo = data['subtitulo'];
        this.volver = data['volver'];
        this.title.setTitle(" PRESABER .::. " + this.titulo);

        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.titulo
        };

        this.meta.updateTag(metaTag);
      })

  }

  ngOnInit(): void {

  }

  getDataRoute() {
    return this.router.events
      .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
        map((evento: ActivationEnd) => evento.snapshot.data)
      );
  }

}
