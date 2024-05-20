import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'; 
import { MatDialog } from '@angular/material/dialog';
import * as emailjs from 'emailjs-com';
import { Reservation } from 'src/app/private/model/reservation';
import { EmailService } from 'src/app/private/services/email.service';
import { NotifService,AppNotification } from 'src/app/private/services/notif.service';
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

 email:string|null=localStorage.getItem('email') ;
 username=localStorage.getItem('username') ;
  constructor(public reservationService: ReservationService,
    private router: Router,private fb:FormBuilder,
    public emailService:EmailService,
    private NotifService: NotifService
    
   ) {}


   notifications: AppNotification[] = [];

   sendEmail() {
  const emaill =this.email;
     const to: string[] = [this.email!]; // Adreslse e-mail du destinataire
     const cc: string[] = [this.email!]; // Adresse e-mail en copie
     const subject = "Reservation "; // Sujet du courriel
     const body = "Dear "+this.username+",\n your Order Has Been Successfully Placed! \n Best regards, \n Admin"; 
   
     this.emailService.sendEmail(to, cc, subject, body).subscribe(
       response => {
         console.log('Email sent successfully', response);
         const newNotification: AppNotification = {
           date_envoi: new Date().toISOString().split('T')[0], // Date au format YYYY-MM-DD
           heure: new Date().toLocaleTimeString(), // Heure actuelle
           type: 'Email',
           titre: subject,
           message: body
         };
         this.NotifService.addNotification(newNotification).subscribe(
           notifResponse => {
             console.log('Notification stored successfully', notifResponse);
             this.notifications.push(notifResponse); // Ajouter la nouvelle notification à la liste
           },
           notifError => {
             console.error('Error storing notification', notifError);
           }
         );
       
   
   
   
       },
       error => {
         console.error('Error sending email', error);
       }
     );
   }
   

   sendEmail1() {
    const emaill =this.email;
       const to: string[] = [this.email!]; // Adreslse e-mail du destinataire
       const cc: string[] = [this.email!]; // Adresse e-mail en copie
       const subject = "reservation request"; // Sujet du courriel
       const body = "Dear "+this.username+",\n Your reservation has been successfully made.\n However, it requires the administrator's approval.\n We will inform you as soon as the validation is complete.\nThank you for your understanding. \nBest regards,  \n Admin"; 
     
       this.emailService.sendEmail(to, cc, subject, body).subscribe(
         response => {
           console.log('Email sent successfully', response);
           const newNotification: AppNotification = {
             date_envoi: new Date().toISOString().split('T')[0], // Date au format YYYY-MM-DD
             heure: new Date().toLocaleTimeString(), // Heure actuelle
             type: 'Email',
             titre: subject,
             message: body
           };
           this.NotifService.addNotification(newNotification).subscribe(
             notifResponse => {
               console.log('Notification stored successfully', notifResponse);
               this.notifications.push(notifResponse); // Ajouter la nouvelle notification à la liste
             },
             notifError => {
               console.error('Error storing notification', notifError);
             }
           );
         
     
     
     
         },
         error => {
           console.error('Error sending email', error);
         }
       );
     }
     
  

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
  
  

  
 // Méthode appelée lors du clic sur le bouton de validation
 onAddMoreClicked(): void {
  this.reservationService.sendAddMoreClicked();
}
validateReservation() {
  let hasRoom = false;
  let hasEquipment = false;

  for (const item of this.reservationService.checkedItems) {
    // Check if the reservation has a room or just equipment
    if (item.category === 'Rooms') {
      hasRoom = true;
    } else if (item.category === 'Equipments') {
      hasEquipment = true;
    }
  }

  if (hasRoom && !hasEquipment) {
    // Reservation has a room but no equipment
    for (const item of this.reservationService.checkedItems) {
      // Modify state to "On Hold"
      item.state = 'On Hold';
      this.sendEmail1();


    }
    this.addReservationFromCheckedItems(); // Add reservation
 // Send email
   // alert('Reservation created but needs admin permission.');
  } else if (!hasRoom && hasEquipment) {
    this.addReservationFromCheckedItems();
    this.sendEmail(); // Add reservation
   // Send email
   // alert('Reservation added successfully.');
  } else {
    // Both room and equipment are present, handle as per your requirements
    // You may want to add a specific logic for this scenario
    //alert('Reservation contains both room and equipment. Please handle this case.');
  }

  this.reservationService.sendAddMoreClicked();
 
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
      state: item.category === 'Rooms' ? 'On Hold' : 'Reserved',
      benefit_status: "default"
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
        console.log('Reservation added successfully but needs admin Authority:', response);
      },
      (error) => {
        console.error('Error adding reservation:', error);
      }
    );
  }
   
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
