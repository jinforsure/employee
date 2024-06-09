import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js/auto';
//import { createChart } from './charts1';
import { createChartDoughunt } from './charts2';
import { ReservationService } from '../../services/reservation.service';
import { EquipmentsService } from '../../services/equipments.service';
import { Reservation } from '../../model/reservation';
import { Equipments } from '../../model/equipments';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {
  currentMonth: string = ''; // Variable pour stocker le mois actuel
  reservationDepartDates: string[] = []; // Variable pour stocker les dates de départ des réservations
  reservationsThisMonth: number = 0; // Variable pour stocker le nombre de réservations ce mois-ci
  equipmentStates: string[] = []; // Variable pour stocker les états des équipements
  disabledCount: number = 0; // Variable pour stocker le nombre d'états "disabled"
  totalEquipments: number = 0; // Variable pour stocker le nombre total d'équipements
  pour:number=0;

  mostReservedEquipment: Equipments | undefined;
   maxCount:number=0;
  lineChart: any;
  monthOccurrences: Map<number, number> = new Map();

  constructor(private reservationService: ReservationService,private equipmentService: EquipmentsService) {  

   }


  ngOnInit(): void {
    this.getCurrentMonth();
    this.getReservationDepartDates();
    this.getEquipmentStates();
    this.getAllReservationsAndCountOccurrences(); 
    this.generatePieChart();
    this.getMostReservedEquipment();
  }

 
  getMostReservedEquipment(): void {
    this.reservationService.getAllReservations().subscribe(reservations => {
      const equipmentCounts: Map<number, number> = new Map();

      // Comptez le nombre de réservations pour chaque équipement
      reservations.forEach(reservation => {
        const equipmentId = reservation.equipmentsId; // Assurez-vous que equipmentId est un nombre
        if (equipmentId) {
          if (equipmentCounts.has(equipmentId)) {
            equipmentCounts.set(equipmentId, equipmentCounts.get(equipmentId)! + 1);
          } else {
            equipmentCounts.set(equipmentId, 1);
          }
        }
      });

      // Trouvez l'équipement le plus réservé
      let maxCount = 0;
      let mostReservedEquipmentId = 0;
      equipmentCounts.forEach((count, equipmentId) => {
        if (count > maxCount) {
          maxCount = count;
          mostReservedEquipmentId = equipmentId;
        }console.log("maxCount",maxCount);
        this.maxCount=maxCount;
      });

      // Récupérez les détails de l'équipement le plus réservé
      // Utilisez le service pour récupérer les détails de l'équipement en fonction de l'ID
      if (mostReservedEquipmentId) {
        this.equipmentService.getEquipmentsById(mostReservedEquipmentId).subscribe(equipment => {
          this.mostReservedEquipment = equipment;
        });
      }
    });
  }
 
  getAllReservationsAndCountOccurrences(): void {
    this.reservationService.getAllReservations().subscribe(reservations => {
      reservations.forEach(reservation => {
        if (reservation.departDate) { // Vérifie si departDate n'est pas null
          const departureDateParts = (reservation.departDate as string).split('-');
          const month = parseInt(departureDateParts[1], 10);
          if (!isNaN(month)) { // Vérifie si le mois est un nombre valide
            if (this.monthOccurrences.has(month)) {
              const currentCount = this.monthOccurrences.get(month) as number;
              this.monthOccurrences.set(month, currentCount + 1);
            } else {
              this.monthOccurrences.set(month, 1);
            }
          }
        }
      });
  
      this.monthOccurrences.forEach((occurrences, month) => {
        console.log('Month ${month}: ${occurrences} occurrences');
      });
  
      // Créez le graphique une fois que la boucle forEach est terminée
      this.createLineChart();
    });
  }
   
  getMonthName(month: number): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month - 1]; // Soustrayez 1 car les mois commencent à 0 dans JavaScript
  }
  createLineChart(): void {
    if (this.lineChart) {
      this.lineChart.destroy(); // Détruire le graphique existant s'il existe
    }
  
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const months = Array.from(this.monthOccurrences.keys());
      const occurrences = Array.from(this.monthOccurrences.values());
  
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months.map(month => this.getMonthName(month)),
          datasets: [{
            label: 'Reservation Occurrences',
            data: occurrences,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error('Failed to get 2D context for line chart canvas');
    }
  }
  
  
  
  generatePieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    const pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Reservations', 'Remaining'],
        datasets: [{
          data: [this.reservationsThisMonth, 100 - this.reservationsThisMonth], // Utilisez la valeur actuelle et le complément à 100 pour les données
          backgroundColor: [
            'rgb(255, 99, 132)', // Couleur pour les réservations
            'rgb(54, 162, 235)' // Couleur pour le reste
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }




  
 
  
  getCurrentMonth(): void {
    const currentDate = new Date(); // Obtenez la date actuelle
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentMonth = monthNames[currentDate.getMonth()]; // Obtenez le nom du mois actuel
  }
  getReservationDepartDates(): void {
    this.reservationService.getAllReservations().subscribe(reservations => {
      // Bouclez à travers toutes les réservations et extrayez les dates de départ
      this.reservationDepartDates = reservations.map(reservation => reservation.departDate)
        .filter(date => date !== undefined) // Filtrez les valeurs undefined
        .map(date => date as string); // Convertissez le type en string
  
      // Initialisez la variable de somme des réservations pour ce mois
      this.reservationsThisMonth = 0;
  
      // Obtenez le mois actuel
      const currentMonth = new Date().getMonth() + 1; // Ajoutez 1 car les mois dans JavaScript commencent à 0
  
      // Bouclez à travers les dates de départ et comparez les mois avec le mois actuel
      this.reservationDepartDates.forEach(date => {
        // Vérifiez si la date est null avant de la traiter (ceci est facultatif si vous êtes sûr que les dates ne sont pas nulles)
        if (date) {
          // Analyser la chaîne de date dans le format "DD-MM-YYYY"
          const [day, month, year] = date.split('-');
          // Convertir la chaîne en nombre pour comparer avec le mois actuel
          const reservationMonth = parseInt(month, 10);
          if (reservationMonth === currentMonth) {
            // Si le mois de la réservation correspond au mois actuel, augmentez le nombre de réservations ce mois-ci
            this.reservationsThisMonth++;
          }
        }
      });
      
      console.log('Nombre de réservations pour chaque mois : ', this.reservationsThisMonth);
    });
    console.log(this.reservationsThisMonth);
  }
  
  getEquipmentStates(): void {
    this.equipmentService.getAllEquipments().subscribe(equipments => {
      // Bouclez à travers tous les équipements et extrayez les états
      const equipmentStates = equipments.map(equipment => equipment.maintenance_status)
        .filter(state => state !== undefined) // Filtrez les valeurs undefined
        .map(state => state as string); // Convertissez le type en string si nécessaire

      // Calculer le nombre d'états égaux à "disabled"
      this.disabledCount = equipmentStates.filter(state => state === 'damaged').length;
      console.log(this.disabledCount);
      // Mettre à jour le nombre total d'équipements
      this.totalEquipments = equipmentStates.length;
      console.log(this.totalEquipments);
      this.pour=(this.disabledCount /this. totalEquipments) * 100
    });
  }

  ngAfterViewInit() {
    const canvasLineChart = document.getElementById('lineChart');
    const canvasDoughuntChart = document.getElementById('doughuntChart');

    if (canvasLineChart instanceof HTMLCanvasElement) {
      const ctxLineChart = canvasLineChart.getContext('2d');
      if (ctxLineChart) {
      //  const lineChart = createChart(ctxLineChart);
      this.createLineChart();
      } else {
        console.error('Failed to get 2D context for line chart canvas');
      }
    } else {
      console.error('Failed to find canvas element with id "myChart"');
    }

    if (canvasDoughuntChart instanceof HTMLCanvasElement) {
      const ctxDoughuntChart = canvasDoughuntChart.getContext('2d');
      if (ctxDoughuntChart) {
        // Récupérez les données des équipements depuis votre source de données
        // Par exemple, en appelant un service qui récupère les données des équipements
        this.equipmentService.getAllEquipments().subscribe(equipments => {
          // Créez le graphique doughnut avec les données des équipements
          const doughuntChart = createChartDoughunt(ctxDoughuntChart, equipments);
        });
      } else {
        console.error('Failed to get 2D context for doughnut chart canvas');
      }
    } else {
      console.error('Failed to find canvas element with id "doughuntChart"');
    }
    this.createLineChart();
  }
  // Circonférence du cercle

  
  calculateStrokeOffset(value: number): number {
    if (value < 0) value = 0;
    if (value > 100) value = 100;

    const filledLength = 226.08 * (value / 100); // 226.08 is the circumference of the circle
    return 226.08 - filledLength;
  }
  

}
