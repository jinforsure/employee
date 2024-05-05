import { Chart, ChartConfiguration } from 'chart.js/auto';

export function createChartDoughunt(ctx: CanvasRenderingContext2D): Chart<'doughnut', number[], string> {
  const doughnutConfig: ChartConfiguration<'doughnut', number[], string> = {
    type: 'doughnut',
    data: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  return new Chart<'doughnut', number[], string>(
    ctx,
    doughnutConfig
  );
}
