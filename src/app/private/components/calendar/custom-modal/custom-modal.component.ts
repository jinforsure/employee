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
  
  
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      if (isBefore(selectedDate, currentDate)) {
        return { pastDate: true }; // Return an error if the date is in the past
      }
      return null; // Return null if validation succeeds
    };
  }
  
  
}