import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { isSameDay, isBefore } from 'date-fns';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent {
  selectedDate: string = '';
  selectedDepartureTime: string = '';
  selectedReturnTime: string = '';
  reservationForm: FormGroup;

  // List of holidays in Tunisia
  holidays: Date[] = [
    new Date('2024-06-16'), // Eid Al Adha
    new Date('2024-06-17'), // Eid Al Adha
    new Date('2024-07-07'), // Ras El Am Hijri
    new Date('2024-07-25'), // Fête Nationale de la République
    new Date('2024-09-15'), // Mouled
    new Date('2024-10-15')  // Fête de l'évacuation
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomModalComponent>
  ) {
    this.reservationForm = this.fb.group({
      departureDate: ['', [Validators.required, this.futureDateValidator(), this.holidayDateValidator()]],
      departureTime: ['', Validators.required],
      returnTime: ['', Validators.required]
    }, { validators: this.timeRangeValidator() });

    this.reservationForm.get('departureDate')?.valueChanges.subscribe(value => {
      this.selectedDate = value;
      console.log('Departure date changed:', value);
    });

    this.reservationForm.get('departureTime')?.valueChanges.subscribe(value => {
      this.selectedDepartureTime = value;
      console.log('Departure time changed:', value);
    });

    this.reservationForm.get('returnTime')?.valueChanges.subscribe(value => {
      this.selectedReturnTime = value;
      console.log('Return time changed:', value);
    });

    this.reservationForm.valueChanges.subscribe(formValue => {
      console.log('Form value changed:', formValue);
    });

    if (this.data && this.data.departureDate) {
      this.reservationForm.patchValue({
        departureDate: this.data.departureDate,
        departureTime: this.data.departureTime,
        returnTime: this.data.returnTime
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  formatDate(dateString: string): string {
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    } else {
      console.warn('Le format de date n\'est pas reconnu:', dateString);
      return dateString;
    }
  }

  navigateAndSave() {
    this.selectedDate = this.reservationForm.get('departureDate')?.value;
    this.selectedDepartureTime = this.reservationForm.get('departureTime')?.value;
    this.selectedReturnTime = this.reservationForm.get('returnTime')?.value;

    const formattedDate = this.formatDate(this.selectedDate);
    console.log('Navigating with query params:', {
      date: formattedDate,
      departureTime: this.selectedDepartureTime,
      returnTime: this.selectedReturnTime
    });

    this.router.navigate(['/reservation'], {
      queryParams: {
        date: formattedDate,
        departureTime: this.selectedDepartureTime,
        returnTime: this.selectedReturnTime
      }
    });

    this.dialogRef.close();
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      if (isBefore(selectedDate, today) && !isSameDay(selectedDate, today)) {
        return { pastDate: true };
      }
      return null;
    };
  }

  holidayDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const selectedMonth = selectedDate.getMonth();
  
      // Check if the selected date is a holiday
      for (let holiday of this.holidays) {
        if (isSameDay(selectedDate, holiday)) {
          return { holidayDate: true };
        }
      }
  
      return null;
    };
  }
  
  

  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {
        const departureDate = control.get('departureDate')?.value;
        const departureTime = control.get('departureTime')?.value;
        const returnTime = control.get('returnTime')?.value;

        if (departureDate && departureTime && returnTime) {
          const selectedDepartureDate = new Date(departureDate);
          const currentTime = new Date();
          const currentHour = currentTime.getHours();
          const currentMinute = currentTime.getMinutes();
          const isToday = isSameDay(selectedDepartureDate, currentTime);

          if (isToday) {
            const selectedDepartureTime = new Date(`2000-01-01T${departureTime}`);
            const selectedHour = selectedDepartureTime.getHours();
            const selectedMinute = selectedDepartureTime.getMinutes();

            if (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute < currentMinute)) {
              return { pastDepartureTime: true };
            }
          }

          const departureHour = parseInt(departureTime.split(':')[0]);
          const returnHour = parseInt(returnTime.split(':')[0]);

          if (departureHour < 8 || returnHour > 18) {
            return { invalidTimeRange: true };
          }

          if (departureHour >= returnHour) {
            return { invalidTimeOrder: true };
          }
          if (this.isDepartureTimeInJulyAugustAfter14(departureDate, departureTime)) {
            return { invalidDepartureTime: true };
          }
        }
      }

      return null;
    };
  }
  
  isDepartureTimeInJulyAugustAfter14(departureDate: string, departureTime: string): boolean {
    const selectedDate = new Date(departureDate);
    const selectedMonth = selectedDate.getMonth();
    const selectedDepartureTime = new Date(`2000-01-01T${departureTime}`);
    const selectedHour = selectedDepartureTime.getHours();

    const isAfter14JulyAugust = (selectedMonth === 6 || selectedMonth === 7) && selectedHour >= 14;
    console.log(`Departure date: ${departureDate}, Departure time: ${departureTime}, Is after 14:00 in July/August: ${isAfter14JulyAugust}`);
    
    return isAfter14JulyAugust;
}


  isFormValid(): boolean {
    return this.reservationForm.valid && !this.reservationForm.hasError('pastDate');
  }

  ngOnInit(): void {
    this.timeRangeValidator();
  }
}
