import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarEvent, CalendarView,  } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  activeButton: string | undefined;
  activeDayIsOpen =false;

  events: CalendarEvent[] = [];
  refresh = new Subject<void>();

  selectedDate: string='';
  selectedDepartureTime: string='';
  selectedReturnTime: string='';
  reservationForm: FormGroup = this.fb.group({  // Initialize reservationForm inline
    departureDate: [null, [Validators.required, this.futureDateValidator()]],
    departureTime: [null, [Validators.required, Validators.pattern('^08:3[0-9]|0[9-9]:[0-5][0-9]$')]],
    returnTime: [null, [Validators.required, Validators.pattern('^(1[0-7]|0[0-9]):[0-5][0-9]$')]]
  });

  

  constructor(private router :Router ,private fb: FormBuilder){
    const event1 = {
      title: "Pc hp Reservation",
      start: new Date("2024-04-25T10:30"),
      end: new Date("2024-04-25T13:00"),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      this:this.reservationForm = this.fb.group({
        departureDate: [null, [Validators.required, this.futureDateValidator()]],
        departureTime: [null, [Validators.required, Validators.pattern('^08:3[0-9]|0[9-9]:[0-5][0-9]$|^0[9-9]:[0-5][0-9]$|1[0-7]:[0-5][0-9]$')]],
        returnTime: [null, [Validators.required, Validators.pattern('^(1[0-7]|0[0-9]):[0-5][0-9]$')]]
      })
    }

    this.events.push(event1);
  }

  setView(view : CalendarView) {
    this.view = view;
  }

  dayClicked({date,events}: {date: Date; events: CalendarEvent[] }): void {
    if(isSameMonth(date, this.viewDate)){
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true ) || events.length === 0
      ) {
        this.activeDayIsOpen =false;
      } else {
        this.activeDayIsOpen = true;
      }
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
  // bech etsjel date w ethzni lel reservation
  navigateAndSave() {
    this.router.navigate(['/reservation'], {
      queryParams: {
        date: this.selectedDate,
        departureTime: this.selectedDepartureTime,
        returnTime: this.selectedReturnTime
      }
    });
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

  

}
