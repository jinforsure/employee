import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';

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
        if (this.accountType === 'Admin' || this.accountType === 'Technician') {
          this.reservations = reservations;
        } else if (this.accountType === 'Employee' && this.username) {
          this.reservations = reservations.filter(reservation => reservation.username === this.username);
        }
        this.filterReservations(this.selectedStatus); // Apply initial filtering
      });
  }

  getCurrentDateInDDMMYYYY(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // Note: month is 0-based
  }

  filterReservations(state: string): void {
    const currentDateStr = this.getCurrentDateInDDMMYYYY();
    const currentDate = this.parseDate(currentDateStr);

    this.filteredReservations = this.reservations.filter(reservation => {
      const departDate = this.parseDate(reservation.departDate!);
      console.log("current date:", currentDateStr);
      console.log("reservation depart date:", reservation.departDate);
      console.log("parsed depart date:", departDate);
      console.log("comparison result:", departDate < currentDate);
      return departDate && departDate < currentDate;
    }).filter(reservation => {
      if (state === 'all') {
        return true;
      } else {
        return reservation.state === state;
      }
    });

    console.log('Filtered reservations:', this.filteredReservations);
  }

  onStatusChange(state: string): void {
    this.selectedStatus = state;
    this.filterReservations(state);
  }
}
