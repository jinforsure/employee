import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { createChart } from './charts1';
import { createChartDoughunt } from './charts2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {

  constructor() { }

  ngAfterViewInit() {
    const canvasLineChart = document.getElementById('lineChart');
    const canvasDoughuntChart = document.getElementById('doughuntChart');

    if (canvasLineChart instanceof HTMLCanvasElement) {
      const ctxLineChart = canvasLineChart.getContext('2d');
      if (ctxLineChart) {
        const lineChart = createChart(ctxLineChart);
      } else {
        console.error('Failed to get 2D context for line chart canvas');
      }
    } else {
      console.error('Failed to find canvas element with id "myChart"');
    }

    if (canvasDoughuntChart instanceof HTMLCanvasElement) {
      const ctxDoughuntChart = canvasDoughuntChart.getContext('2d');
      if (ctxDoughuntChart) {
        const doughuntChart = createChartDoughunt(ctxDoughuntChart);
      } else {
        console.error('Failed to get 2D context for doughnut chart canvas');
      }
    } else {
      console.error('Failed to find canvas element with id "doughuntChart"');
    }
  }
  

}