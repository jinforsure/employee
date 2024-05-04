import { Component } from '@angular/core';
import { CalendarEvent, CalendarView,  } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dateFns from 'date-fns';


import { Injectable } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {viewDate: Date = new Date();
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
    this.reservationForm = this.fb.group({
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnTime: ['', Validators.required]
    });
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
    // Récupérer et afficher la valeur de la date de départ
   // Récupérer et afficher la valeur de la date de départ
this.selectedDate = this.reservationForm.get('departureDate')?.value;
console.log('Selected Departure Date:', this.selectedDate);

// Récupérer et afficher la valeur de l'heure de départ
this.selectedDepartureTime = this.reservationForm.get('departureTime')?.value;
console.log('Selected Departure Time:', this.selectedDepartureTime);

// Récupérer et afficher la valeur de l'heure de retour
this.selectedReturnTime = this.reservationForm.get('returnTime')?.value;
console.log('Selected Return Time:', this.selectedReturnTime);



// Formatter la date au format "jj-mm-aaaa"
const formattedDate = this.formatDate(this.selectedDate);
console.log('Selected Departure Daaaaaaaate:', this.selectedDate);



// Afficher les paramètres de requête avant la navigation
console.log('Navigating with query params:', {
    date: formattedDate,
    departureTime: this.selectedDepartureTime,
    returnTime: this.selectedReturnTime
});

// Naviguer vers la route /reservation avec les paramètres de requête
this.router.navigate(['/reservation'], {
    queryParams: {
        date: formattedDate,
        departureTime: this.selectedDepartureTime,
        returnTime: this.selectedReturnTime
    }
});
  
}
// Fonction de formatage de date
formatDate(dateString: string): string {
  // Utiliser une expression régulière pour extraire les parties de la date
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
      // Reformater la date dans le format "jj-mm-aaaa" en inversant l'ordre des composants
      return match[3] + '-' + match[2] + '-' + match[1];
  } else {
      // Retourner la date d'origine si le format n'est pas reconnu
      console.warn('Le format de date n\'est pas reconnu:', dateString);
      return dateString;
  }
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

  timeFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const timePattern = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
      const isValid = timePattern.test(control.value);

      return isValid ? null : { invalidTimeFormat: true };
    };
  }


}
