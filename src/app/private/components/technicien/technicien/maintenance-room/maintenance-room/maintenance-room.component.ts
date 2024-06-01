import { Component } from '@angular/core';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';
import { Reservation } from 'src/app/private/model/reservation';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { EmailService } from 'src/app/private/services/email.service';
import { NotifService,AppNotification } from 'src/app/private/services/notif.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-maintenance-room',
  templateUrl: './maintenance-room.component.html',
  styleUrls: ['./maintenance-room.component.css']
})
export class MaintenanceRoomComponent {

  equipments: Rooms[] = [];
  selectedEquipment: Rooms | undefined;
  tableauResultat: { roomsId: number , departureDate: Date, departureHour: string, returnHour: string }[] = [];
  searchText: string ='';
  email:string|null=localStorage.getItem('email') ;
  username=localStorage.getItem('username') ;
  equipmentsWithDate: { roomsId: number, departureDate: Date, departureHour: string, returnHour:string ,equipmentData:Rooms,benefit_status: string;}[] = [];

  FinalEquipmentData: {
    roomsId: number;
    date: Date;
    departureTime: string; // Ajout de l'heure de départ
    returnTime: string; // Ajout de l'heure de retour
    equipmentData: any;
    benefit_status: string;
  }[]=[];
  filteredEquipmentData: {
    roomsId: number;
    date: Date;
    departureTime: string;
    returnTime: string;
    equipmentData: Rooms;
    benefit_status: string;
  }[] = [];

  disableReservationState: boolean = false;
  disableReturned: boolean = false;
  disableoccupied: boolean = false;
  maintenanceStatuses: string[] = ['operational', 'under maintenance', 'damaged'];

   donneesFinales: any[] = [];
    donneesEquipements: any[] = [];
  constructor(
    private equipmentService: RoomsService,
    private reservationService: ReservationService,
    private emailService:EmailService,
    private NotifService: NotifService,
    private datePipe: DatePipe


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
  
  sendEmail3() {
    const emaill =this.email;
       const to: string[] = [this.email!]; // Adreslse e-mail du destinataire
       const cc: string[] = [this.email!]; // Adresse e-mail en copie
       const subject = " Important Reminder Regarding Your Reservation !!!!!! "; // Sujet du courriel
       const body = "Dear "+this.username+",\n This is a friendly reminder regarding your reservation  scheduled for "+"[Departure Date] at [Departure Time]. \n Please ensure that you are ready for the pickup or usage of the equipment at the specified time.\n Best regards, \n Technicien";
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
    // Inside the ngOnInit or relevant initialization method
   this.equipmentService.getAllRooms().subscribe((equipments: Rooms[]) => {
   this.equipments = equipments.map(equipment => {
    // Set default maintenance status to 'Operational' if not already set
    if (!equipment.maintenance_status) {
      equipment.maintenance_status = 'operational';
    }
    return equipment;
  });
});

  }
  
  
  loadFutureReservationsAndEquipments() {
    // Obtenir la date actuelle
    const currentDate = new Date();
  
    // Récupérer toutes les réservations
    this.reservationService.getAllReservations().subscribe((reservations: Reservation[]) => {
      console.log('Toutes les réservations:', reservations);
  
      // Filtrer les réservations à partir de la date actuelle et concernant des équipements
      const futureReservations = reservations.filter(reservation => {
        if (!reservation.departDate || !reservation.departHour || !reservation.returnHour) {
          console.log("55555555");
          return false; // Exclure les réservations sans date de départ, heure de départ, heure de retour
        }
  
        if (reservation.category !== 'Rooms') {
          return false; // Exclure cette réservation si elle ne concerne pas des équipements
        }
        console.log("190    : ", reservation.roomsId)
        // Convertir la date de départ de la réservation en objet Date avec le bon format
        const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
        const departureDate = new Date(year, month - 1, day); // Soustraire 1 de month car les mois sont indexés à partir de 0
        const departHourParts = reservation.departHour.split(':');
        const departHour = parseInt(departHourParts[0], 10);
        const departMinutes = parseInt(departHourParts[1], 10);
        const returnHourParts = reservation.returnHour.split(':');
        const returnHour = parseInt(returnHourParts[0], 10);
        const returnMinutes = parseInt(returnHourParts[1], 10);
        

        if (departureDate.toDateString() === currentDate.toDateString() &&
        (returnHour > currentDate.getHours() || (returnHour === currentDate.getHours() && returnMinutes >= currentDate.getMinutes()))) {
        return true;
    }

    // Check if departure date is after current date
    if (departureDate > currentDate) {
        return true;
    }
        console.log("depart date : ",departureDate.toDateString())
        console.log("current date : ",currentDate.toDateString())
        console.log("depart hour : ",departHour)
        console.log("current hour : ",currentDate.getHours())
        // Vérifier si la date de départ est après la date actuelle et que la date de retour est la même que la date de départ
        return departureDate >= currentDate || (departureDate.toDateString() === currentDate.toDateString() && (departHour > currentDate.getHours() || (departHour === currentDate.getHours() && departMinutes > currentDate.getMinutes())));
      });
      
      // Traiter les réservations futures
      futureReservations.forEach(reservation => {
        if (reservation.roomsId !== null && reservation.roomsId !== undefined) {

          const roomsId: number = reservation.roomsId;
          console.log("roomId",roomsId);
          // Assurez-vous que c'est un number
          this.equipmentService.getRoomsById(roomsId).subscribe((equipment: Rooms) => {
            console.log('Équipement associé à la réservation:', equipment);
  
            // Assurez-vous que tous les champs requis sont présents
            if (reservation.departDate && reservation.departHour && reservation.returnHour) {
              const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
              const departureDate = new Date(year, month - 1, day);
              console.log("equipmentsWithDate 205",this.equipmentsWithDate);
              this.equipmentsWithDate.push({
                roomsId: roomsId, // Utilisez la variable temporaire qui est garantie d'être un number
                departureDate: departureDate,
                departureHour: reservation.departHour,
                returnHour: reservation.returnHour,
                benefit_status:reservation.benefit_status!,
                equipmentData: equipment
              });
  
              console.log("equipmentsWithDate",this.equipmentsWithDate);
              console.log("futureReservations",futureReservations);
              
              // Vérifier si toutes les opérations asynchrones sont terminées
              if (this.equipmentsWithDate.length === futureReservations.length) {
                this.filterAndProcessData();
              }
            }
          });
        }
      });
  
    });
  
    // Récupérer tous les équipements
    this.equipmentService.getAllRooms().subscribe((equipement: Rooms[]) => {
      console.log('Tous les equip:', this.equipments);
  
      // Stockez les équipements dans la variable de classe equipments
      this.equipments = equipement;
    }); this.checkReminder();
    
  }
  checkReminder(): void {
    const currentDate = new Date();
    const currentDateString = this.datePipe.transform(currentDate, 'dd/MM/yyyy');
    let emailSent = false;
    this.FinalEquipmentData.forEach(equipmentData => {
      const departDateString = this.datePipe.transform(equipmentData.date, 'dd/MM/yyyy');
      if (currentDateString === departDateString) {
        const departHour = equipmentData.departureTime.split(':');
        const departDate = new Date();
        const departHourNumber = parseInt(departHour[0], 10);
        const departMinuteNumber = parseInt(departHour[1], 10);
        departDate.setHours(departHourNumber, departMinuteNumber, 0);

        const reminderTime = new Date(departDate.getTime() - 30 * 60000);
       
        if (currentDate >= reminderTime && currentDate < departDate && !emailSent) {
          // Envoie l'email de rappel
          this.sendEmail3();
          
          // Met à jour la variable de contrôle pour indiquer que l'email a été envoyé
          emailSent = true;
      }
      }
    });
  }
  
  filterAndProcessData() {
      // Parcourir chaque élément de tableauResultat
      this.equipmentsWithDate.forEach(element => {
        // Extraire l'ID de l'équipement
        const roomsId = element.roomsId;

        // Vérifier si l'ID de l'équipement est défini
        if (roomsId !== null) {
          const date = element.departureDate;
          const departureTime = element.departureHour;
          const returnTime = element.returnHour;
          const benefit_status = element.benefit_status
          // Rechercher les données de l'équipement correspondant à cet ID, à cette date et à cette heure
          const equipmentDataForId = this.equipments.find(equipment => equipment.id === roomsId );
          console.log(equipmentDataForId);
          // Vérifier si des données ont été trouvées
          if (equipmentDataForId) {
            equipmentDataForId.free = "free";
            equipmentDataForId.occupied = "occupied";
            equipmentDataForId.reservation_State = "Reserved";
            // Ajouter les données trouvées au tableau final
            this.FinalEquipmentData.push({
              roomsId: roomsId,
              date: date,
              departureTime: departureTime,
              returnTime: returnTime,
              benefit_status: benefit_status,
              equipmentData: equipmentDataForId
            });
            console.log("benefit_status", benefit_status);
          }
        }
      });
  
      this.FinalEquipmentData.sort((a, b) => {
        // Compare les dates
        const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateComparison !== 0) {
          return dateComparison; // Si les dates sont différentes, retourne la comparaison des dates
        }
        // Si les dates sont les mêmes, compare les heures
        return (parseInt(a.departureTime.split(':')[0], 10) * 60 + parseInt(a.departureTime.split(':')[1], 10)) -
               (parseInt(b.departureTime.split(':')[0], 10) * 60 + parseInt(b.departureTime.split(':')[1], 10));
      });
    
      // Afficher les données finales
      console.log("Final Equipment Data", this.FinalEquipmentData);
    }
  
  
    onFieldChange(newValue: any, fieldName: string) {
      // Store the new value with the name of the modified field
      console.log('New value of', fieldName, ':', newValue);
    
      // Disable other fields if the condition is met
      if (fieldName === 'maintenance_status' && newValue === 'under maintenance') {
        this.disableReservationState = false; // Enable Reservation State
        this.disableReturned = true; // Disable Returned
        this.disableoccupied = true; // Disable occupied
    
        // Set Reservation State to 'Not yet' for all equipment data
        this.FinalEquipmentData.forEach((equipmentData: any) => {
          if (equipmentData.equipmentData) {
            equipmentData.equipmentData.reservation_State = 'Not yet';
          }
        });
      } else if (fieldName === 'maintenance_status' && newValue === 'damaged') {
        this.disableReservationState = false; // Enable Reservation State
        this.disableReturned = true; // Disable Returned
        this.disableoccupied = true; // Disable occupied
    
        // Set Reservation State to 'Not yet' for all equipment data
        this.FinalEquipmentData.forEach((equipmentData: any) => {
          if (equipmentData.equipmentData) {
            equipmentData.equipmentData.reservation_State = 'Not yet';
          }
        });
      } else if (fieldName === 'state' && newValue === 'Disabled') {
        // Disable fields if Equipment State is 'Disabled'
        this.disableReservationState = true;
        this.disableReturned = true;
        this.disableoccupied = true;
      } else {
        // Enable all fields if they don't match the disable conditions
        this.disableReservationState = false;
        this.disableReturned = false;
        this.disableoccupied = false;
      }
    
      // You can store the new value in an object or array as needed
    }
    
    

// Définir des variables de contrôle pour activer ou désactiver l'édition des champs
performAction(equipement: any) {
  // Afficher une alerte de confirmation
  const confirmation = window.confirm("Are you sure you want to perform this action?");

  // Vérifier si l'utilisateur a confirmé
  if (confirmation) { 
    // Vérifier si les champs Maintenance Status et Equipment State ont les valeurs nécessaires pour désactiver les autres champs
    if (
      (equipement.equipmentData.maintenance_status === 'damaged' || equipement.equipmentData.maintenance_status === 'under maintenance') &&
      equipement.equipmentData.state === 'Disabled'
    ) {
      // Désactiver les autres champs
      this.disableReservationState = true;
      this.disableReturned = true;
      this.disableoccupied = true;
      equipement.equipmentData.reservation_State = 'Not yet';
    } else {
      // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
      this.disableReservationState = false;
      this.disableReturned = false;
      this.disableoccupied = false;
    }

    const roomIdToUpdate = equipement.roomsId;
    const index = this.FinalEquipmentData.findIndex((e: any) => e.roomsId === equipement.roomsId);
    console.log("equipement.equipmentData.reservation_State ", equipement.equipmentData.reservation_State);
    
    if (equipement.equipmentData.reservation_State === 'Not yet') {
      // Stocker l'ID de la salle dans une variable
      console.log('ID de la equip à mettre à jour:', roomIdToUpdate);

      // Supprimer les réservations associées à cette salle
      this.reservationService.getAllReservations().subscribe(
        (reservations: any[]) => {
          reservations.forEach((reservation: any) => {
            console.log("rrrrrrrrr", reservation.roomsId, roomIdToUpdate);
            if (reservation.roomsId === roomIdToUpdate) {
              console.log("'''''''''");
              this.reservationService.deleteReservation(reservation.id).subscribe(
                () => {
                  console.log('La réservation associée à la equip a été supprimée avec succès.');
                  this.sendEmail();
                  console.log("Action performed for equipment:", equipement);
                }
              );
            }
          });
        }
      );
    }

    const equipData = equipement.equipmentData.occupied;    
    const heure1 = equipement.departureTime;
    const heure2 = equipement.returnTime;
    const departureDate = formatDateToString(equipement.date);

    // Vérifier la date et l'heure actuelles
    const currentDate = new Date();
    const currentHour = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0');
    const currentDateString = currentDate.toISOString().split('T')[0];

    console.log("Current Date: ", currentDateString);
    console.log("Current Time: ", currentHour);
    console.log("Departure Date: ", departureDate);
    console.log("Departure Time: ", heure1);
    console.log("Return Time: ", heure2);
    console.log("equip data : ", equipData);
    // Vérifier et mettre à jour le Benefit State si occupied ou returned
    if (equipData === 'occupied' || equipData === 'free') {
      // Additional condition to check if the return time is <= current time
      const returnTime = new Date(`${currentDateString}T${heure2}:00`);
      console.log("430 : ",returnTime);
      const currentTime = new Date(`${currentDateString}T${currentHour}:00`);
      console.log("432 : ", currentTime);

      console.log("equip data : ", (departureDate === currentDateString));
      console.log("equip data : ", (heure1 === currentHour));
      console.log("equip data : ", (returnTime >= currentTime));
      console.log("equip data : ", (departureDate === currentDateString && heure1 === currentHour));
      console.log("equip data : ", (departureDate === currentDateString && returnTime >= currentTime));
      if ( (departureDate === currentDateString && heure1 === currentHour) || (departureDate === currentDateString && returnTime >= currentTime)){
        const departDateequip = this.formatDateToDDMMYYYY(departureDate);
        this.reservationService.getAllReservations().subscribe((reservations: any[]) => {
          reservations.forEach((reservation: any) => {
             //console.log("448: ", departDateequip)
             //console.log("448: ", reservation.departDate)
             //console.log("448: ", reservation.departDate === departDateequip)
            if (reservation.roomsId === roomIdToUpdate && reservation.departHour === heure1 && reservation.returnHour === heure2 && reservation.departDate === departDateequip) {
              //console.log("448: ", reservation.departDate)
              //console.log("equip id : ", reservation.roomsId);
              //console.log("equip id : ", roomIdToUpdate);
              if (equipData === 'occupied' && reservation.benefit_status=== 'default') {
                console.log("be state : ",reservation.benefit_status)
                reservation.benefit_status = 'occupied';
                console.log("be state 452: ",reservation.benefit_status)
              } else if ( reservation.benefit_status=== 'occupied' ) {
                console.log("be state : ",reservation.benefit_status)
                reservation.benefit_status = 'free';
                console.log("be state 455: ",reservation.benefit_status)
              }
              console.log("be state : ",reservation.benefit_status)
              console.log("be state : ",equipData)
              this.reservationService.updateReservation(reservation.id, { benefit_status: reservation.benefit_status }).subscribe(() => {
                console.log(`Benefit State updated for reservation ${reservation.id}`);
              }, error => {
                console.error(`Error updating Benefit State for reservation ${reservation.id}`, error);
              });
            }
          });
        });
      } else {
        alert("Can't change benefit state before date and time");
        return;
      }
    }

    console.log("Action performed for equipment:", equipement);

    if (index !== -1) {
      const roomsId = equipement.roomsId;
      const modifiedCharacteristics = {
        quantity: equipement.equipmentData.quantity,
        maintenance_status: equipement.equipmentData.maintenance_status,
        reservation_State: equipement.equipmentData.reservation_State,
        state: equipement.equipmentData.state,
      };

      console.log("ID de l'équipement modifié:", roomsId);
      console.log("Caractéristiques modifiées:", modifiedCharacteristics);

      this.equipmentService.editRooms(equipement.roomsId, equipement.equipmentData).subscribe(response => {
        console.log('Mise à jour réussie', response);
      }, error => {
        console.error('Erreur lors de la mise à jour', error);
      });
    } else {
      console.error("ID d'équipement non trouvé dans donneesEquipements.");
    }
  } else {
    console.log("L'exécution de l'action a été annulée.");
  }
}

formatDateToDDMMYYYY(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}



toggleBenefitState(equipmentData: any) {
  console.log('Initial equipmentData:', equipmentData);
  console.log(' equipmentData.benefit_status    :', equipmentData.benefit_status);
  // Toggle benefit status
  if (equipmentData.benefit_status === 'occupied') {
    console.log(' equipmentData.benefit_status    :', equipmentData.benefit_status);
    equipmentData.benefit_status = 'free';
  } else {
    equipmentData.benefit_status = 'occupied';
  }

  console.log('Updated equipmentData:', equipmentData);

  // Update the reservation status based on the new benefit status
  const roomIdToUpdate = equipmentData.roomsId;
  const heure1 = equipmentData.departureTime;
  const heure2 = equipmentData.returnTime;
  const departureDate = this.formatDateToString(equipmentData.date);

 /* this.reservationService.getAllReservations().subscribe((reservations: any[]) => {
    reservations.forEach((reservation: any) => {
      console.log('Checking reservation:', reservation);

      if (
        reservation.roomsId === roomIdToUpdate &&
        reservation.departHour === heure1 &&
        reservation.returnHour === heure2 &&
        reservation.departDate === departureDate
      ) {
        reservation.benefit_status = equipmentData.benefit_status;
        console.log("Updating benefit_status to:", reservation.benefit_status);

        this.reservationService.updateReservation(reservation.id,reservation.benefit_status ).subscribe(
          () => {
            console.log(`Benefit State updated for reservation ${reservation.id}`);
          },
          (error) => {
            console.error(`Error updating Benefit State for reservation ${reservation.id}`, error);
          }
        );
      }
    });
  });*/
}

formatDateToString(date: any): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}


getBenefitStateColor(status: string): string {
  switch (status) {
    case 'occupied':
      return 'yellow';
    case 'free':
      return 'green';
    case 'default':
      return 'grey';
    default:
      return 'white';
  }
}


}

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
