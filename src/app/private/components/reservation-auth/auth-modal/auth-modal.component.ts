import { Component, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reservation } from 'src/app/private/model/reservation';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { EmailService } from 'src/app/private/services/email.service';
import { NotifService,AppNotification } from 'src/app/private/services/notif.service';
@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {
  constructor(    @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AuthModalComponent>,
  private reservationService: ReservationService,
  public emailService:EmailService,
  private NotifService: NotifService
){}
email:string|null=localStorage.getItem('email') ;
 username=localStorage.getItem('username') ;
  reservation : Reservation ={username: '',name:'',category:'',subCategory:'',departDate:'',departHour:'',returnHour:'',state:'' };
  reservationId: string |null = null;
  state: string |null = null;
  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.state = this.data.state;
    this.reservationId= this.data.reservationId
    console.log("state 2 : ", this.state);
    console.log("state id : ", this.reservationId);
}

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
displayEquipments(id : number){
  this.reservationService.getReservationById(id).subscribe((res) =>
  {this.reservation = res ;});
}


saveEmployee(){
const reservationId = this.data.reservationId;
console.log("employe 1 : ", reservationId)
if (reservationId) {
  this.updateEmployee(reservationId);
  console.log("employe 2 : ", reservationId)
  this.sendEmail();
  
}
}


updateEmployee (id: number){
console.log("employe 2 : ", this.reservation)
this.reservationService
.editReservation(id, this.reservation)
.subscribe((res) => {
  console.log(res);
  window.location.reload();
});
this.dialogRef.close();
}

}
