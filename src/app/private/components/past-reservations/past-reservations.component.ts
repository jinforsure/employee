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
        if (this.accountType === 'Admin' || this.accountType === 'technician') {
          this.reservations = reservations;
        } else if (this.accountType === 'Employee' && this.username) {
          this.reservations = reservations.filter(reservation => reservation.username === this.username);
        }
        // Filter out past reservations
        this.filteredReservations = this.reservations.filter(reservation => {
          if (reservation.departDate) {
            return reservation.departDate < currentDate;
          }
          return false; // Filter out reservations with undefined departureDate
        });
        this.filterReservations(this.selectedStatus);
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
