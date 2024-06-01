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
        const currentDate = new Date(); // Current date object
        let filteredSet = new Set<Reservation>(); // Utiliser un ensemble pour éliminer les doublons
  
        if (this.accountType === 'Admin' || this.accountType === 'Technician') {
          filteredSet = new Set(reservations.filter(reservation => reservation.category === 'Rooms'));
        } else if (this.accountType === 'Employee' && this.username) {
          filteredSet = new Set(reservations.filter(reservation => reservation.username === this.username && reservation.category === 'Rooms'));
        }
  
        // Filtrer les réservations en fonction à la fois de l'état et de la date de départ
        filteredSet.forEach(reservation => {
          if (reservation.departDate) {
            const departDateParts = reservation.departDate.split('-');
            const departDate = new Date(parseInt(departDateParts[2]), parseInt(departDateParts[1]) - 1, parseInt(departDateParts[0]));
            console.log("departDate",departDate)
            // Extract day, month, and year from departure date
            const departDay = departDate.getDate();
            const departMonth = departDate.getMonth() + 1; // Month is zero-based
            const departYear = departDate.getFullYear();
           
            // Extract day, month, and year from current date
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth() + 1; // Month is zero-based
            const currentYear = currentDate.getFullYear();
  
            // Compare year first
            if (departYear > currentYear ||
                (departYear === currentYear && departMonth > currentMonth) ||
                (departYear === currentYear && departMonth === currentMonth && departDay >= currentDay)) {
              this.filteredReservations.push(reservation);
            }
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
