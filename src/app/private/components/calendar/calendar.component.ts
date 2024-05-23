import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { MatDialog } from '@angular/material/dialog';
import { Component,ChangeDetectionStrategy } from '@angular/core';
import {isSameDay,isSameMonth, } from 'date-fns';
import { Subject } from 'rxjs';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { CustomModalComponent } from './custom-modal/custom-modal.component';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  colors: Record<string, string> = {
    green: '#008000', // Event is already done
    yellow: '#FFFF00', // Event is ongoing
    blue: '#0000FF', // Event is not happening yet
    grey: '#808080'  // Holiday
  };

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  activeButton: string | undefined;
  activeDayIsOpen =false;

  events: CalendarEvent<any>[] = [];
  refresh = new Subject<void>();

  reservations: {
      username: any; name: string, departDate: string, departHour: string, returnHour: string 
}[] = [];
  eventsList: CalendarEvent[] = [];

  selectedDate: string='';
  selectedDepartureTime: string='';
  selectedReturnTime: string='';
  reservationForm: FormGroup ;

  holidays: { date: string, name: string }[] = [
    { date: '2024-06-16', name: 'Eid Al Adha' },
    { date: '2024-06-17', name: 'Eid Al Adha' },
    { date: '2024-07-07', name: 'Ras El Am Hijri' },
    { date: '2024-07-25', name: 'National Day of the Republic' },
    { date: '2024-09-15', name: 'Mouled' },
    { date: '2024-10-15', name: 'Evacuation day' },
  ];
  holidayEvents: CalendarEvent[] = [];


  constructor(private router :Router ,private fb: FormBuilder, private reservationService: ReservationService, private dialog: MatDialog ){
      this.reservationForm = this.fb.group({  
        departureDate: [null, [Validators.required, this.futureDateValidator()]],
        departureTime: [null, [Validators.required, Validators.pattern('^08:[0-5][0-9]$|^09:[0-5][0-9]$|^1[0-7]:[0-5][0-9]$')]],
        returnTime: [null, [Validators.required, Validators.pattern('^08:[0-5][0-9]$|^09:[0-5][0-9]$|^1[0-7]:[0-5][0-9]$')]],
      }, { validators: this.timeRangeValidator() }); // Ajouter le validateur de plage d'heures
      
    const event1 = {
      title: "Pc hp Reservation",
      start: new Date("2024-04-25T10:30"),
      end: new Date("2024-04-25T10:30"),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }};

    this.events.push(event1);
    this.reservationForm.get('departureDate')?.valueChanges.subscribe(value => {
      this.selectedDate = value; // Mettre à jour selectedDate
      console.log('Departure date changed:', value);
    });
    // Écouteur d'événement de modification pour le champ 'departureTime'
    this.reservationForm.get('departureTime')?.valueChanges.subscribe(value => {
      this.selectedDepartureTime = value; // Mettre à jour selectedDepartureTime
      console.log('Departure time changed:', value);
    });

    // Écouteur d'événement de modification pour le champ 'returnTime'
    this.reservationForm.get('returnTime')?.valueChanges.subscribe(value => {
      this.selectedReturnTime = value; // Mettre à jour selectedReturnTime
      console.log('Return time changed:', value);
    });

    // Observateur de valeur pour tout le formulaire
    this.reservationForm.valueChanges.subscribe(formValue => {
      console.log('Form value changed:', formValue);
    });
  }

  ngOnInit(): void {
    this.getAllReservations();
    this.timeRangeValidator();
    this.addHolidaysToCalendar();
  }
  setView(view : CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("92");
    if (isSameMonth(date, this.viewDate)) {
      console.log("94");
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        console.log("99");
        this.activeDayIsOpen = false;
      } else {
        console.log("102");
        this.activeDayIsOpen = true;
      }
      console.log("105");
      this.viewDate = date;
    }
  }
  
  eventClicked(event : any){
    console.log(event);
  }
  eventTimesChanged(event: any){
    event.event.start = event.newStart;
    event.event.end = event.newEnd;
    this.refresh.next();
  }


  //bech etvalidi el modal 
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      if (selectedDate < currentDate) {
        return { invalidDate: true };
      }
      return null;
    };
  }

  getAllReservations() {
    const accountType = localStorage.getItem('account_type');
    const username = localStorage.getItem('username');
    
    if (!accountType || !username) {
      console.error('Account type or username not found in local storage.');
      return;
    }
  
    this.reservationService.getAllReservations().subscribe(reservations => {
      this.events = reservations
        .filter(reservation => {
          // Filter out reservations in the "On Hold" and "Cancelled" states
          return reservation.state !== 'On Hold' && reservation.state !== 'Cancelled';
        })
        .filter(reservation => {
          // Filter reservations with state "Reserved" or without a state
          return reservation.state === 'Reserved' || !reservation.state;
        })
        .filter(reservation => {
          // Apply account type filter
          if (accountType === 'Admin' || accountType === 'Technician') {
            return true;
          }
          return reservation.username === username;
        })
        .filter(reservation => reservation.departDate)
        .map(reservation => {
          const dateParts = reservation.departDate!.split('-');
          const formattedDate = `${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`;
  
          const returnTimeParts = reservation.returnHour!.split(':');
          const departTimeParts = reservation.departHour!.split(':');
          const returnHour = parseInt(returnTimeParts[0]);
          const returnMinute = parseInt(returnTimeParts[1]);
          const end = new Date(formattedDate);
          end.setHours(returnHour);
          end.setMinutes(returnMinute);
  
          const departHour = parseInt(departTimeParts[0]);
          const departMinute = parseInt(departTimeParts[1]);
          const start = new Date(formattedDate);
          start.setHours(departHour);
          start.setMinutes(departMinute);
  
          let color: EventColor = { primary: '', secondary: '' };
  
          // Determine event color based on reservation state
          if (reservation.state === 'Cancelled') {
            color = { primary: 'red', secondary: 'red' };
          } else {
            // Determine event color based on current date
            const now = new Date();
            if (now > end) {
              color = { primary: 'green', secondary: 'green' }; // Event has already ended
            } else if (now >= start && now <= end) {
              color = { primary: 'yellow', secondary: 'yellow' }; // Event is ongoing
            } else {
              color = { primary: 'blue', secondary: 'blue' }; // Event has not yet started
            }
          }
  
          return {
            id: reservation.id,
            username: reservation.username, // Use reservation.username directly
            title: reservation.name ?? 'Unknown',
            start: start,
            end: end,
            color: color,
            meta: {
              equipmentStatus: reservation.benefit_status
            }
          };
        });
  
      console.log('All Reservations:', this.events);
    });
  }


  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {
        const departureDate = control.get('departureDate')?.value;
        const departureTime = control.get('departureTime')?.value;
        const returnTime = control.get('returnTime')?.value;
  
        if (departureDate && departureTime && returnTime) {
          // Convertir la date de départ en objet Date
          const selectedDepartureDate = new Date(departureDate);
          const currentTime= new Date();
          const currentHour = currentTime.getHours();
          const currentMinute = currentTime.getMinutes();
          const isToday = isSameDay(selectedDepartureDate, currentTime);
  
          // Si la date de départ est aujourd'hui en Tunisie
          if (isToday) {
            // Convertir l'heure de départ en objet Date
            const selectedDepartureTime = new Date(`2000-01-01T${departureTime}`);
            const selectedHour = selectedDepartureTime.getHours();
            const selectedMinute = selectedDepartureTime.getMinutes();
  
           // Si l'heure de départ est dans le passé par rapport à l'heure actuelle
           if (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute < currentMinute)) {
            return { pastDepartureTime: true };
          }
        }

        // Vérifier si les heures sont dans l'intervalle spécifié (08:00 - 18:00)
        const departureHour = parseInt(departureTime.split(':')[0]);
        const returnHour = parseInt(returnTime.split(':')[0]);

        if (departureHour < 8 || returnHour > 18) {
          return { invalidTimeRange: true };
        }

        // Vérifier si l'heure de départ est avant l'heure de retour
        if (departureHour >= returnHour) {
          return { invalidTimeOrder: true };
        }
      }
    }

    return null;
    };
  }
  
  
  getEventColor(event: CalendarEvent<any>): string {
    const now = new Date();
    const start = event.start instanceof Date ? event.start : undefined;
    const end = event.end instanceof Date ? event.end : undefined;

    if (!start || !end) {
      // Handle the case where start or end date is undefined or not a valid Date object
      return ''; // Return an empty string or a default color
    }

    if (now > end) {
      return this.colors['green']; // Event is already done
    } else if (now >= start && now <= end) {
      return this.colors['yellow']; // Event is ongoing
    } else {
      return this.colors['blue']; // Event is not happening yet
    }
  }

  cancelReservation(event: CalendarEvent<any>): void {
    const now = new Date();
    const start = event.start instanceof Date ? event.start : undefined;
    
    // Check if the reservation is in the past or ongoing
    if (!start || start <= now) {
      console.error('Cannot cancel past or ongoing reservation.');
      alert('Cannot cancel past or ongoing reservation.');
      return; // Exit the method if the reservation is in the past or ongoing
    }
    
    const confirmation = confirm('Are you sure you want to cancel this reservation?');
    console.log("cancel reservation");
    if (confirmation && event.id) {
      const reservationId: number = typeof event.id === 'string' ? parseInt(event.id, 10) : event.id;
      console.log("reservation id : ", reservationId);
      
      // Call the service method to update the reservation state
      this.reservationService.updateReservation(reservationId, { state: 'Cancelled' }).subscribe(() => {
        // On successful cancellation, log a message and possibly refresh the reservation data
        console.log('Reservation cancelled:', event);
        // Change the color of the cancelled reservation to red
        event.color = { primary: 'red', secondary: 'red' };
        // You might want to refresh the reservations after cancellation
        this.getAllReservations();
      }, error => {
        // Handle error if cancellation fails
        console.error('Failed to cancel reservation:', error);
      });
    } else {
      console.error('Cannot cancel reservation: Event ID is undefined.');
    }
  }
  
  
  openCustomModal(selectedDate: string, departureTime: string, returnTime: string) {
    this.dialog.open(CustomModalComponent, {
      data: {
        departureDate: selectedDate,
        departureTime: departureTime,
        returnTime: returnTime
      }
    });
    console.log("departDate : ",selectedDate);
    console.log("departHour : ",departureTime);
    console.log("returnHour : ",returnTime);
  }
  

  scrollToTable() {
    const table = document.getElementById('reservation-table');
    if (table) {
      table.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  getColorBasedOnStatus(status: string): EventColor {
    switch (status) {
      case 'taken':
        return { primary: '#ad2121', secondary: '#FAE3E3' }; // Red
      case 'returned':
        return { primary: '#1e90ff', secondary: '#D1E8FF' }; // Blue
      default:
        return { primary: '#e3bc08', secondary: '#FDF1BA' }; // Yellow
    }
  }

  addHolidaysToCalendar() {
    this.holidays.forEach(holiday => {
      const dateParts = holiday.date.split('-');
      const holidayDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
      const startDateTime = new Date(holidayDate);
      startDateTime.setHours(8, 0, 0); // Set start time to 8 am
      console.log("start date ",startDateTime)
      const endDateTime = new Date(holidayDate);
      endDateTime.setHours(19, 0, 0); // Set end time to 6 pm
      console.log("start date ",endDateTime)
      const holidayEvent: CalendarEvent = {
        title: holiday.name,
        start: startDateTime,
        end: endDateTime,
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
      };
  
      this.holidayEvents.push(holidayEvent);
    });
  
    this.refresh.next();
  }
  
  
}