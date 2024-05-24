import { Component } from '@angular/core';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-reservation-auth',
  templateUrl: './reservation-auth.component.html',
  styleUrls: ['./reservation-auth.component.css']
})
export class ReservationAuthComponent {

  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  selectedStatus: string = 'all';
  accountType: string | null = '';
  username: string | null = '';
  isModalOpen: boolean = false;
  selectedReservation: Reservation | null = null;

  constructor(
    private reservationService: ReservationService ,
     private dialog: MatDialog,
     private employeeService: EmployeeService 
    ) { }

  ngOnInit(): void {
    this.accountType = localStorage.getItem('account_type');
    this.username = localStorage.getItem('username');
    this.getReservations();
  }
  getReservations(): void {
    this.reservationService.getAllReservations()
      .subscribe(reservations => {
        const currentDate = this.getCurrentDateInDDMMYYYY();
        let filteredSet = new Set<Reservation>(); // Utiliser un ensemble pour éliminer les doublons
  
        if (this.accountType === 'Admin' || this.accountType === 'Technician') {
          filteredSet = new Set(reservations);
        } else if (this.accountType === 'Employee' && this.username) {
          filteredSet = new Set(reservations.filter(reservation => reservation.username === this.username));
        }
  
        // Filtrer les réservations en fonction à la fois de l'état et de la date de départ
        filteredSet.forEach(reservation => {
          if (reservation.departDate && reservation.departDate >= currentDate) {
            this.filteredReservations.push(reservation); // Ajouter les réservations qui respectent les critères au tableau
          }
        });
  
        console.log('Filtered reservations:', this.filteredReservations);
      });
  }
  

  
  
  getCurrentDateInDDMMYYYY(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
  
    return `${day}-${month}-${year}`;
  }
  

  openAuthModal(state: any , reservation :any, reservationId:any): void {
    const dialogRef = this.dialog.open(AuthModalComponent, {
      width: '500px',
      data: { state , reservation , reservationId
       }
    });
    console.log("state : ",state);
    console.log("res id : ",reservation);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any necessary actions after the modal is closed
    });
  }
}
