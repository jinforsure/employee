import { Component, ElementRef, Inject, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { isBefore, isSameDay } from 'date-fns';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent{
  selectedDate: string='';
  selectedDepartureTime: string='';
  selectedReturnTime: string='';
  reservationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomModalComponent>
  ) {
    this.reservationForm = this.fb.group({
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnTime: ['', Validators.required]
    });

    // Set initial form values based on data passed from calendar component
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

  navigateAndSave() {
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

    // Close the modal
    this.dialogRef.close();
  }
  

  
  isFormValid(): boolean {
    return this.reservationForm.valid && !this.reservationForm.hasError('pastDate');
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
  
  
}