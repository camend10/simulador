import { Component } from '@angular/core';
import { SimulacroService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';

import * as echarts from 'echarts';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  usuario!: Usuario;
  bandera: boolean = false;

  materias1: any[] = [];
  materias2: any[] = [];
  materias3: any[] = [];

  cargando: boolean = true;


  constructor(public _usuarioService: UsuarioService,
    public _simulacroService: SimulacroService
  ) {
    this.usuario = this._usuarioService.usuario;
    this.cargarMaterias();          
  }

  cargarMaterias() {
    this.cargando = true;
    this.bandera = true;
    this._simulacroService.cargarMaterias(1)
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.cargando = false;
          this.bandera = false;
          return EMPTY;
        })
      )
      .subscribe((resp: any) => {
        this.materias1 = resp.materias;
        this.grafPreMatSes1();
        this.cargando = false;
        this.bandera = true;
      });

    this._simulacroService.cargarMaterias(2)
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.bandera = false;
          this.cargando = false;
          return EMPTY;
        })
      )
      .subscribe((resp: any) => {
        this.materias2 = resp.materias;
        this.grafPreMatSes2();
        this.cargando = false;
        this.bandera = true;
      });

    this.cargando = true;

    this._simulacroService.cargarMateriasEntrenador()
      .pipe(
        catchError(error => {
          Swal.fire({
            title: "Error!",
            text: error.error.error,
            icon: "error"
          });
          this.bandera = false;
          this.cargando = false;
          return EMPTY;
        })
      )
      .subscribe((resp: any) => {
        this.materias3 = resp.materias;
        this.grafPreMatSes3();
        this.cargando = false;
        this.bandera = true;
      })
  }


  grafPreMatSes1() {
    setTimeout(() => {

      let data = this.materias1.map((item, index) => {
        return {
          name: item.test_name,
          value: item.numpre
        };
      });

      var chartDom = document.getElementById('grafPreMatSes1');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Preguntas por sesión 1',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 25,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      };

      option && myChart.setOption(option);

    }, 1000);
  }

  grafPreMatSes2() {
    setTimeout(() => {

      let data = this.materias2.map((item, index) => {
        return {
          name: item.test_name,
          value: item.numpre
        };
      });

      var chartDom = document.getElementById('grafPreMatSes2');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Preguntas por sesión 2',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 25,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      };

      option && myChart.setOption(option);

    }, 1000);
  }

  grafPreMatSes3() {
    setTimeout(() => {
        
      let data = this.materias3.map((item, index) => {
        return {
          name: item.test_name,
          value: item.total_que
        };
      });

      var chartDom = document.getElementById('grafPreMatSes3');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Preguntas por materias total prueba',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 25,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      };

      option && myChart.setOption(option);

    }, 1000);
  }


}
