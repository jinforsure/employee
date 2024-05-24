import { Chart,ChartConfiguration } from "chart.js/auto";


export function createChartDoughunt(ctx: CanvasRenderingContext2D, equipmentData: any[]): Chart<'doughnut', number[], string> {
  // Comptez le nombre d'équipements dans chaque état de maintenance
  const operationalCount = equipmentData.filter(equipment => equipment.maintenance_status === 'Operational').length;
  const underMaintenanceCount = equipmentData.filter(equipment => equipment.maintenance_status === 'under maintenance').length;
  const damagedCount = equipmentData.filter(equipment => equipment.maintenance_status === 'Damaged').length;

  // Configuration du graphique doughnut avec les données mises à jour
  const doughnutConfig: ChartConfiguration<'doughnut', number[], string> = {
    type: 'doughnut',
    data: {
      labels: ['Operational', 'Damaged', 'Under Maintenance'],
      datasets: [{
        label: 'Equipment Maintenance Status',
        data: [operationalCount, underMaintenanceCount, damagedCount],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 205, 86, 0.2)'
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1
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

  // Créez et retournez le graphique doughnut avec la configuration mise à jour
  return new Chart<'doughnut', number[], string>(
    ctx,
    doughnutConfig
  );
}
