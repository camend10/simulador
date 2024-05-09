import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Graficas1Component } from "./graficas1/graficas1.component";
import { PagesComponent } from "./pages.component";
import { ProgressComponent } from "./progress/progress.component";
import { PromesasComponent } from "./promesas/promesas.component";
import { RxjsComponent } from "./rxjs/rxjs.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { LoginGuardGuard, adminGuard, verificaTokenGuard } from "../services/service.index";
import { PerfilComponent } from "./perfil/perfil.component";
import { UsuarioComponent } from "./usuarios/usuario.component";
import { CambiarComponent } from "./perfil/cambiar.component";
import { InstitucionesComponent } from "./institucion/instituciones.component";
import { InstitucionComponent } from "./institucion/institucion.component";
import { SimulacrosComponent } from "./simulacros/simulacros.component";
import { SesionesComponent } from "./simulacros/sesiones/sesiones.component";
import { MateriasComponent } from "./simulacros/materias/materias.component";
import { PreguntasComponent } from "./simulacros/preguntas/preguntas.component";
import { ResultSimulacrosComponent } from "./resultados/result-simulacros/result-simulacros.component";
import { ResultadoComponent } from "./resultados/resultado/resultado.component";
import { EntrenadorComponent } from "./entrenador/entrenador.component";

const routes: Routes = [

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Dashboard',
            subtitulo: '',
            volver: ''
        }

    },
    { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
    { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Graficas' } },
    { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
    { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },

    //Usuarios
    {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Perfil de usuario',
            subtitulo: 'Perfil',
            volver: 'dashboard'
        }
    },
    {
        path: 'cambiar-clave',
        component: CambiarComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Cambiar Clave',
            subtitulo: 'Cambiar clave',
            volver: 'dashboard'
        }
    },
    {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [adminGuard, verificaTokenGuard],
        data: {
            titulo: 'Gestión de Usuarios',
            subtitulo: 'Usuarios',
            volver: 'dashboard'
        }
    },
    {
        path: 'usuario/:id',
        component: UsuarioComponent,
        canActivate: [adminGuard, verificaTokenGuard],
        data: {
            titulo: 'Gestión de Usuario',
            subtitulo: 'Usuario',
            volver: 'usuarios'
        }
    },

    // Instituciones
    {
        path: 'instituciones',
        component: InstitucionesComponent,
        canActivate: [adminGuard, verificaTokenGuard],
        data: {
            titulo: 'Gestión de Instituciones',
            subtitulo: 'Instituciones',
            volver: 'dashboard'
        }
    },
    {
        path: 'institucion/:id',
        component: InstitucionComponent,
        canActivate: [adminGuard, verificaTokenGuard],
        data: {
            titulo: 'Gestión de Institución',
            subtitulo: 'Institución',
            volver: 'instituciones'
        }
    },

    // Simulacros
    {
        path: 'simulacros',
        component: SimulacrosComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Simulacros',
            subtitulo: 'simulacros',
            volver: 'dashboard'
        }
    },
    {
        path: 'sesiones/:id',
        component: SesionesComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Sesiones',
            subtitulo: 'sesiones',
            volver: 'simulacros'
        }
    },
    {
        path: 'materias/:simulacro_id/:sesion_id',
        component: MateriasComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Materias',
            subtitulo: 'materias',
            volver: 'simulacros'
        }
    },
    {
        path: 'preguntas/:simulacro_id/:sesion_id/:materia_id',
        component: PreguntasComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Preguntas',
            subtitulo: 'preguntas',
            volver: 'simulacros'
        }
    },

    // Resultados
    {
        path: 'resultados-simulacros',
        component: ResultSimulacrosComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Resultados por simulacros',
            subtitulo: 'Resultados',
            volver: 'dashboard'
        }
    },
    {
        path: 'resultado/:simulacro_id',
        component: ResultadoComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Resultado',
            subtitulo: 'Resultado simulacro',
            volver: 'dashboard'
        }
    },

    // Entrenador
    {
        path: 'entrenador',
        component: EntrenadorComponent,
        canActivate: [verificaTokenGuard],
        data: {
            titulo: 'Entrenador',
            subtitulo: 'Entrenador',
            volver: 'dashboard'
        }
    },

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }

];

export const PAGES_ROUTES = RouterModule.forChild(routes);