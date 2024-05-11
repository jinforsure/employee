import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'; 
import { MatDialog } from '@angular/material/dialog';
import * as emailjs from 'emailjs-com';
import { Reservation } from 'src/app/private/model/reservation';
@Component({
  selector: 'app-listreserv',
  templateUrl: './listreserv.component.html',
  styleUrls: ['./listreserv.component.css']
})
export class ListreservComponent {
  reservationState: any[] = [];
  selectedDate:string='';
  departureTime:string='';
  returnTime:string='';
 data:any[]=[];
  constructor(public reservationService: ReservationService,
    private router: Router,private fb:FormBuilder
   ) {}

  ngOnInit() {
    console.log("ahaya",this.reservationService.checkedItems);
  
   // hedhy feha date et heure  ili hiye checked
    this.reservationService.getReservationState().subscribe((data: any[]) => {
      // Mettez à jour la variable locale avec les données de l'état de réservation
      this.reservationState = data;
      this.data=data;
      console.log("",data);
    
     
    });
  }
  
  form :FormGroup=this.fb.group({
  
    to_name: "asma",
    
    from_name: '',
    from_email:'',
    subject:'',
    message:''
    });

async send(){
  emailjs.init('GDIu91oJLy4x2Qpry');
  let response =await emailjs.send("service_a7y27df","template_g4ch4ug",{
    from_name: 'Admin', // Remplacez par votre nom
    to_name: 'Asma', // Remplacez par le nom du destinataire
    from_email: 'contact@teamdev.tn ', // Remplacez par votre adresse e-mail
    subject: 'Reservation', // Remplacez par le sujet du message
    message: 'Your Reservation is added successfully'
  }).then(response => {
    // Traitez la réponse si nécessaire
    alert('Message sent successfully!');
  }).catch(error => {
    // Traitez les erreurs si nécessaire
    console.error('Error sending message:', error);
    alert('An error occurred while sending the message.');
  });
}
  
 // Méthode appelée lors du clic sur le bouton de validation
 onAddMoreClicked(): void {
  this.reservationService.sendAddMoreClicked();
}
 validateReservation() {
  for (const item of this.reservationService.checkedItems) {
    // Extraire les informations nécessaires de l'objet 'item'
     this.selectedDate = item.selectedDate;
     this.departureTime = item.selectedDepartureTime;
     this.returnTime = item.selectedReturnTime;

    // Vérifier si l'élément possède les propriétés nécessaires
    if ('category' in item &&'type' in item && 'selectedDate' in item && 'selectedDepartureTime' in item && 'selectedReturnTime' in item && 'id' in item) {
      const category = item.category;
      const id = item.id;
      const subcategory=item.type;
      const selectedDate=this.selectedDate;
    ///  equipmentIds.push(id);
      // Maintenant, vous avez toutes les informations nécessaires pour chaque élément
      // Faites ce que vous devez faire avec ces informations, comme les envoyer à un service ou les traiter directement ici
      console.log('Selected Date:', this.selectedDate);
      console.log('Departure Time:', this.departureTime);
      console.log('Return Time:', this.returnTime);
      console.log('Category:', category);
      console.log('Subcategory:', subcategory);
      console.log('ID:', id);

      // Continuez à exécuter votre logique de validation ou d'autres opérations ici
    }
  }
   // Stocker les identifiants d'équipements dans la liste avant d'appeler la méthode 'addReservationFromCheckedItems'
  // console.log('Equipment IDs:', equipmentIds);// Appeler la méthode pour ajouter les réservations

  
  this.addReservationFromCheckedItems();
  this.reservationService.sendAddMoreClicked();
  this.send();
  this.router.navigate(['/calendar']);
}

addReservationFromCheckedItems() {
  const username = localStorage.getItem('username') ?? ''; 
  for (const item of this.reservationService.checkedItems) {
    const reservation: Reservation = {
      departDate: item.selectedDate,
      departHour: item.selectedDepartureTime,
      returnHour: item.selectedReturnTime,
      category: item.category,
      subCategory:item.type,
      username: username,
      name: item.name,
      state:item.state
    };
console.log("fi add fama ???????",reservation);//nnonn 
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

  console.log("f go back ------------",this.reservationState);
  this.reservationState=this.data;
this.reservationService.storeReservationState(this.reservationState);
 // Naviguer vers la page de réservation
  this.router.navigate(['/reservation']); // Remplacez '/previous-page' par le chemin de la page précédente
}
Back(){
  this.router.navigate(['/calendar']);
}


}
