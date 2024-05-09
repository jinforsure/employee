import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { Injectable } from '@angular/core';

import { Reservation } from 'src/app/private/model/reservation';
@Component({
  selector: 'app-listreserv',
  templateUrl: './listreserv.component.html',
  styleUrls: ['./listreserv.component.css']
})
export class ListreservComponent {
  reservationState: any[] = [];
  constructor(public reservationService: ReservationService,
    private router: Router,
   ) {}

  ngOnInit() {
    console.log("ahaya",this.reservationService.checkedItems);
  
    console.log("emchi abaath message ");
    this.reservationService.getReservationState().subscribe((data: any[]) => {
      // Mettez à jour la variable locale avec les données de l'état de réservation
      this.reservationState = data;
    });
  }
  
 // Méthode appelée lors du clic sur le bouton de validation
 onAddMoreClicked(): void {
  this.reservationService.sendAddMoreClicked();
}
 validateReservation() {

  // Parcourir tous les éléments vérifiés
  for (const item of this.reservationService.checkedItems) {
    // Extraire les informations nécessaires de l'objet 'item'
    const selectedDate = item.selectedDate;
    const departureTime = item.selectedDepartureTime;
    const returnTime = item.selectedReturnTime;

    // Vérifier si l'élément possède les propriétés nécessaires
    if ('category' in item &&'type' in item && 'selectedDate' in item && 'selectedDepartureTime' in item && 'selectedReturnTime' in item && 'id' in item) {
      const category = item.category;
      const id = item.id;
      const subcategory=item.type;

      // Maintenant, vous avez toutes les informations nécessaires pour chaque élément
      // Faites ce que vous devez faire avec ces informations, comme les envoyer à un service ou les traiter directement ici
      console.log('Selected Date:', selectedDate);
      console.log('Departure Time:', departureTime);
      console.log('Return Time:', returnTime);
      console.log('Category:', category);
      console.log('Subcategory:', subcategory);
      console.log('ID:', id);

      // Continuez à exécuter votre logique de validation ou d'autres opérations ici
    }
  }// Appeler la méthode pour ajouter les réservations
  this.addReservationFromCheckedItems();
  this.reservationService.sendAddMoreClicked();
}

addReservationFromCheckedItems() {
  for (const item of this.reservationService.checkedItems) {
    const reservation: Reservation = {
      departDate: item.selectedDate,
      departHour: item.selectedDepartureTime,
      returnHour: item.selectedReturnTime,
      category: item.category,
      subCategory:item.type,
      name:item.name
    };

    // Vérifiez si la catégorie est "Equipments" ou "Rooms"
    if (item.category === 'Equipments') {
      reservation.equipmentsId = item.id;
    } else if (item.category === 'Rooms') {
      reservation.roomsId = item.id;
    }

    // Ajouter la réservation
    this.reservationService.addReservation(reservation).subscribe(
      (response) => {
        console.log('Reservation added successfully:', response);
      },
      (error) => {
        console.error('Error adding reservation:', error);
      }
    );
  }
   
}

showSuccessMessage() {
  alert('Reservation added successfully');
}

goBack() {

  
this.reservationService.storeReservationState(this.reservationState);
 // Naviguer vers la page de réservation
  this.router.navigate(['/reservation']); // Remplacez '/previous-page' par le chemin de la page précédente
}




}
