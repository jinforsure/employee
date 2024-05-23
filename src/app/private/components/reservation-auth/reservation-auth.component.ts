import { Component } from '@angular/core';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private reservationService: ReservationService , private dialog: MatDialog) { }

  ngOnInit(): void {
    this.accountType = localStorage.getItem('account_type');
    this.username = localStorage.getItem('username');
    this.getReservations();
  }

  getReservations(): void {
    this.reservationService.getAllReservations()
      .subscribe(reservations => {
        const currentDate = this.getCurrentDateInDDMMYYYY();
        if (this.accountType === 'Admin' || this.accountType === 'Technician') {
          this.reservations = reservations;
        } else if (this.accountType === 'Employee' && this.username) {
          this.reservations = reservations.filter(reservation => reservation.username === this.username);
        }
  
        // Filter reservations based on both state and departure date
        this.filteredReservations = this.reservations.filter(reservation => {
          if (reservation.departDate && reservation.departDate >= currentDate) {
            return true; // Include reservations with departure date before current date
          }
          return false; // Exclude reservations with undefined departure date or departDate not before currentDate
        })
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
