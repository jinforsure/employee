import { Component } from '@angular/core';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';
import { Reservation } from 'src/app/private/model/reservation';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { EmailService } from 'src/app/private/services/email.service';
import { NotifService,AppNotification } from 'src/app/private/services/notif.service';
@Component({
  selector: 'app-maintenance-room',
  templateUrl: './maintenance-room.component.html',
  styleUrls: ['./maintenance-room.component.css']
})
export class MaintenanceRoomComponent {

  rooms: Rooms[] = [];
  selectedRoom: Rooms | undefined;

  tableauResultat: { roomId: number , departureDate: Date, departureHour: string, returnHour: string }[] = [];


  roomsWithDate: { roomId: number, departureDate: Date, departureHour: string, returnHour:string ,roomData:Rooms}[] = [];

  FinalRoomData: {
    roomId: number;
    date: Date;
    departureTime: string; // Ajout de l'heure de départ
    returnTime: string; // Ajout de l'heure de retour
    roomData: any;
  }[]=[];
disableReservationState: boolean = false;
disablefree: boolean = false;
disableoccupied: boolean = false;


   donneesFinales: any[] = [];
    donneesrooms: any[] = [];
    email:string|null=localStorage.getItem('email') ;
    username=localStorage.getItem('username') ;
  constructor(
    private roomService: RoomsService,
    private reservationService: ReservationService,
    private emailService:EmailService,
    private NotifService: NotifService
  
  ) { }

  notifications: AppNotification[] = [];

  sendEmail() {
 const emaill =this.email;
    const to: string[] = [this.email!]; // Adreslse e-mail du destinataire
    const cc: string[] = [this.email!]; // Adresse e-mail en copie
    const subject = "Important Update Regarding Your Reservation!!! "; // Sujet du courriel
    const body = "Dear "+this.username+",\n We hope this message finds you well. We regret to inform you that due to unforeseen maintenance issues/matters beyond our control, we are unable to honor your reservation at this time.We understand the inconvenience this may cause and sincerely apologize for any disruption to your plans. We are committed to providing the highest quality of service and are taking all necessary steps to resolve these issues promptly.\n Best regards, \n Technicien";
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




  ngOnInit(): void {
    this.loadFutureReservationsAndEquipments();

  }

 
  loadFutureReservationsAndEquipments() {
    // Obtenir la date actuelle
    const currentDate = new Date();
  
    // Récupérer toutes les réservations
    this.reservationService.getAllReservations().subscribe((reservations: Reservation[]) => {
      console.log('Toutes les réservations:', reservations);
  
      // Filtrer les réservations à partir de la date actuelle et concernant des équipements
      const futureReservations = reservations.filter(reservation => {
      //  console.log("11",reservation.departDate);
       // console.log("11",reservation.departHour);
        //console.log("11",reservation.returnHour);

        if (!reservation.departDate || !reservation.departHour || !reservation.returnHour) {
          console.log("*******");
          return false; // Exclure les réservations sans date de départ, heure de départ, heure de retour
        }
  
        if (reservation.category !== 'Rooms') {
          return false; // Exclure cette réservation si elle ne concerne pas des équipements
        }
  
        // Convertir la date de départ de la réservation en objet Date avec le bon format
        const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
        const departureDate = new Date(year, month - 1, day);
        console.log(departureDate);
         // Soustraire 1 de month car les mois sont indexés à partir de 0
         // Vérifier si la date de départ est après la date actuelle et que la date de retour est la même que la date de départ
         console.log("-------");
         
        return departureDate >= currentDate;
      });
  
      // Traiter les réservations futures
      futureReservations.forEach(reservation => {
       
        if (reservation.roomsId !== null && reservation.roomsId !== undefined) {

          const roomId: number = reservation.roomsId; // Assurez-vous que c'est un number
          console.log("roomId",roomId);

          this.roomService.getRoomsById(roomId).subscribe((room: Rooms) => {
            console.log('room associé à la réservation:', room);
  
            // Assurez-vous que tous les champs requis sont présents
            if (reservation.departDate && reservation.departHour && reservation.returnHour) {
              const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
              const departureDate = new Date(year, month - 1, day);
  
              this.roomsWithDate.push({
                roomId: roomId, // Utilisez la variable temporaire qui est garantie d'être un number
                departureDate: departureDate,
                departureHour: reservation.departHour,
                returnHour: reservation.returnHour,
                roomData: room
              });
  
              console.log("roomsWithDate",this.roomsWithDate);
              console.log("futureReservations",futureReservations);
              // Vérifier si toutes les opérations asynchrones sont terminées
              if (this.roomsWithDate.length === futureReservations.length) {
                this.filterAndProcessData();
                console.log("futureReservations",futureReservations);
              //  this.filterAndProcessData();
              }
            }
          });
        }
      });
  
    });
  
    // Récupérer tous les équipements
    this.roomService.getAllRooms().subscribe((room: Rooms[]) => {
      console.log('Tous les room:', this.rooms);
  
      // Stockez les équipements dans la variable de classe equipments
      this.rooms = room;
  
    
    });


  }
  
  
  filterAndProcessData() {

  console.log("eeee");
console.log(this.tableauResultat);
console.log(this.rooms);
      // Parcourir chaque élément de tableauResultat
      this.roomsWithDate.forEach(element => {
        // Extraire l'ID de l'équipement
        const roomId = element.roomId;

        // Vérifier si l'ID de l'équipement est défini
        if (roomId !== null) {
          const date = element.departureDate;
          const departureTime = element.departureHour;
          const returnTime = element.returnHour;
  
          // Rechercher les données de l'équipement correspondant à cet ID, à cette date et à cette heure
          const roomDataForId = this.rooms.find(room => room.id === roomId );
  console.log(roomDataForId);
          // Vérifier si des données ont été trouvées
          if (roomDataForId) {
            roomDataForId.free = "free";
            roomDataForId.occupied = "Not occupied";
            roomDataForId.reservation_State = "Reserved";
            // Ajouter les données trouvées au tableau final
            this.FinalRoomData.push({
              roomId: roomId,
              date: date,
              departureTime: departureTime,
              returnTime: returnTime,
              roomData: roomDataForId
            });
          }
        }
      });
  
      // Trier les données par date
      this.FinalRoomData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
      // Afficher les données finales
      console.log("Final Equipment Data", this.FinalRoomData);
    ;


    
  }
  
  


onFieldChange(newValue: any, fieldName: string) {
  // Stockez la nouvelle valeur avec le nom du champ modifié
  console.log('Nouvelle valeur de', fieldName, ':', newValue);

  // Désactiver les autres champs si la condition est remplie
  if (fieldName === 'maintenance_status' && ['under maintenance', 'Damaged'].includes(newValue)) {
    this.disableReservationState = true;
    this.disablefree = true;
    this.disableoccupied = true;
   
    this.FinalRoomData.forEach((equipmentData: any) => {
      if (equipmentData.roomData && equipmentData.roomData.occupied &&equipmentData.roomData.free) {
        equipmentData.roomData.occupied="Not occupied";
        equipmentData.roomData.free="free";
        equipmentData.roomData.reservation_State="Not yet";
        // Accédez à la propriété occupied de chaque élément
        const occupiedValue = equipmentData.roomData.occupied;
        console.log('Occupied value:', occupiedValue);
      }
    });
   
  } else if (fieldName === 'state' && newValue === 'Disabled') {
    this.disableReservationState = true;
    this.disablefree = true;
    this.disableoccupied = true;
   
   // equipmentData.roomData.reservation_State="Not yet";
    
  } else {
    // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
    this.disableReservationState = false;
    this.disableoccupied = false;
    this.disablefree = false;
 
  }

}

// Définir des variables de contrôle pour activer ou désactiver l'édition des champs
performAction(room: any) {
  // Afficher une alerte de confirmation
  const confirmation = window.confirm("Are you sure you want to perform this action?");
  
  // Vérifier si l'utilisateur a confirmé
  if (confirmation) {
    // Vérifier si les champs Maintenance Status et Equipment State ont les valeurs nécessaires pour désactiver les autres champs
    if (
      (room.roomData.maintenance_status === 'Damaged' || room.roomData.maintenance_status === 'Under maintenance') &&
      room.roomData.state === 'Disabled'
    ) {
      // Désactiver les autres champs
      this.disableReservationState = true;
      this.disablefree = true;
      this.disableoccupied = true;
       // Mettre à jour reservation_State à "Not yet"
  room.roomData.reservation_State = 'Not yet';
     
    } else {
      // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
      this.disableReservationState = false;
      this.disableoccupied = false;
      this.disablefree = false;
       // Mettre à jour reservation_State à "Reserved"
 
      
    } const roomIdToUpdate = room.roomId;
    const index = this.FinalRoomData.findIndex((e: any) => e.roomId === room.roomId);
   
    if (room.roomData.reservation_State === 'Not yet') {
      // Stocker l'ID de la salle dans une variable
     
      console.log('ID de la salle à mettre à jour:', roomIdToUpdate);


      // Supprimer les réservations associées à cette salle
      this.reservationService.getAllReservations().subscribe(
       
        (reservations: any[]) => {
          // Parcourir toutes les réservations
          reservations.forEach((reservation: any) => {
            console.log("rrrrrrrrr",reservation.rooms_id, roomIdToUpdate);
            // Vérifier si la réservation a le même rooms_id que roomIdToUpdate
            if (reservation.roomsId === roomIdToUpdate) {
              console.log("'''''''''");
              // Supprimer la réservation
              this.reservationService.deleteReservation(reservation.id).subscribe(
                () => {
                 
                  console.log('La réservation associée à la salle a été supprimée avec succès.');
                  this.sendEmail();
                  // Mettez ici le code pour gérer l'action pour l'équipement spécifique
                  console.log("Action performed for salle:", room);
                }
              );  
            }
          });
        }
      );
    }
    

    // Mettez ici le code pour gérer l'action pour l'équipement spécifique
    console.log("Action performed for equipment:", room);
console.log("---------",this.donneesrooms);
    // Trouver l'index de l'équipement dans donneesEquipements
  
  

    // Vérifier si l'index est valide
    if (index !== -1 ) {
      // Stocker l'ID de l'équipement
      const roomId = room.roomId;

      // Stocker les caractéristiques modifiées
      const modifiedCharacteristics = {
        // Ajoutez ici les caractéristiques modifiées que vous souhaitez stocker
        // Par exemple, si vous souhaitez stocker la quantité modifiée
      
        maintenance_status: room.roomData.maintenance_status,
       
        reservation_State: room.roomData.reservation_State,
       
      
        state: room.roomData.state
        // Ajoutez d'autres caractéristiques modifiées si nécessaire
      };
    
      // Faites quelque chose avec l'ID de l'équipement et les caractéristiques modifiées
      console.log("ID de l'salle modifié:", roomId);
      console.log("Caractéristiques modifiées:", modifiedCharacteristics);

      // Effectuez la mise à jour de l'équipement
      this.roomService.editRooms(room.roomId, room.roomData).subscribe(response => {
        console.log('Mise à jour réussie', response);
      }, error => {
        console.error('Erreur lors de la mise à jour', error);
      });
    } else {
      console.error("ID d'salle non trouvé dans donneesEquipements.");
    }
  } else {
    // Afficher un message d'annulation
    console.log("L'exécution de l'action a été annulée.");
  }
}


updateFreeField(newValue: string, equipmentData: any) {
  if (newValue === 'occupied') {
      equipmentData.roomData.free = 'Not free';
  } else {
      equipmentData.roomData.free = 'free';
  }
}

updateOccupiedField(newValue: string, equipmentData: any) {
  if (newValue === 'free') {
      equipmentData.roomData.occupied = 'Not occupied';
  } else {
      equipmentData.roomData.occupied = 'occupied';
  }
}

  }




