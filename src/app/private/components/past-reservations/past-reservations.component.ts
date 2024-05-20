import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { state } from '@angular/animations';

@Component({
  selector: 'app-past-reservations',
  templateUrl: './past-reservations.component.html',
  styleUrls: ['./past-reservations.component.css']
})
export class PastReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  selectedStatus: string = 'all';
  accountType: string | null = '';
  username: string | null = '';


  constructor(private reservationService: ReservationService) { }


  

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
          if (reservation.departDate && reservation.departDate < currentDate) {
            return true; // Include reservations with departure date before current date
          }
          return false; // Exclude reservations with undefined departure date or departDate not before currentDate
        }).filter(reservation => {
          // Filter reservations based on selected state
          if (this.selectedStatus === 'all') {
            return true; // Include all reservations
          } else {
            return reservation.state === this.selectedStatus; // Include reservations with matching state
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

  filterReservations(state: string): void {
    console.log('Filtering reservations with state:', state);
    if (state === 'all') {
        this.filteredReservations = this.reservations;
    } else if (state === 'Reserved'){
        this.filteredReservations = this.reservations.filter(reservation => reservation.state === 'Reserved');
    } else if (state === 'Cancelled'){
      this.filteredReservations = this.reservations.filter(reservation => reservation.state === state);
  }
    console.log('Filtered reservations:', this.filteredReservations);
}

  onStatusChange(state: string): void {
    console.log("change")
    this.selectedStatus = state;
    this.filterReservations(state);
  }
}
