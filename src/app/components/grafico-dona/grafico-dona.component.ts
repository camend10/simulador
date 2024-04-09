import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: ``
})
export class GraficoDonaComponent implements OnInit {

  @Input('chartLabels') public doughnutChartLabels: string[] = [];
  @Input('chartData') data = [];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [] },
    ],
  };
  @Input('chartType') public doughnutChartType: ChartType = 'doughnut';

  ngOnInit(): void {
    this.doughnutChartData.labels = this.doughnutChartLabels;
    this.doughnutChartData.datasets[0].data = this.data;
  }
}
