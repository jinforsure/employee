import { Component } from '@angular/core';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';
import { Reservation } from 'src/app/private/model/reservation';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { EmailService } from 'src/app/private/services/email.service';
import { NotifService,AppNotification } from 'src/app/private/services/notif.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-maintenance-equip',
  templateUrl: './maintenance-equip.component.html',
  styleUrls: ['./maintenance-equip.component.css']
})
export class MaintenanceEquipComponent {


  equipments: Equipments[] = [];
  selectedEquipment: Equipments | undefined;
  tableauResultat: { equipmentId: number , departureDate: Date, departureHour: string, returnHour: string }[] = [];
  searchText: string ='';
  email:string|null=localStorage.getItem('email') ;
  username=localStorage.getItem('username') ;
  equipmentsWithDate: { equipmentId: number, departureDate: Date, departureHour: string, returnHour:string ,equipmentData:Equipments}[] = [];

  FinalEquipmentData: {
    equipmentId: number;
    date: Date;
    departureTime: string; // Ajout de l'heure de départ
    returnTime: string; // Ajout de l'heure de retour
    equipmentData: any;
  }[]=[];
  filteredEquipmentData: {
    equipmentId: number;
    date: Date;
    departureTime: string;
    returnTime: string;
    equipmentData: Equipments;
    benefit_status: string;
  }[] = [];

  disableReservationState: boolean = false;
disableReturned: boolean = false;
disableTaken: boolean = false;

   donneesFinales: any[] = [];
    donneesEquipements: any[] = [];
  constructor(
    private equipmentService: EquipmentsService,
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
  
        if (reservation.category !== 'Equipments') {
          return false; // Exclure cette réservation si elle ne concerne pas des équipements
        }
  
        // Convertir la date de départ de la réservation en objet Date avec le bon format
        const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
        const departureDate = new Date(year, month - 1, day); // Soustraire 1 de month car les mois sont indexés à partir de 0
        const departureHour = parseInt(reservation.departHour, 10);
        // Vérifier si la date de départ est après la date actuelle et que la date de retour est la même que la date de départ
        return departureDate >= currentDate || (departureDate.toDateString() === currentDate.toDateString() && departureHour > currentDate.getHours());
      });
  
      // Traiter les réservations futures
      futureReservations.forEach(reservation => {
        if (reservation.equipmentsId !== null && reservation.equipmentsId !== undefined) {

          const equipmentId: number = reservation.equipmentsId;
          console.log("roomId",equipmentId);
          // Assurez-vous que c'est un number
          this.equipmentService.getEquipmentsById(equipmentId).subscribe((equipment: Equipments) => {
            console.log('Équipement associé à la réservation:', equipment);
  
            // Assurez-vous que tous les champs requis sont présents
            if (reservation.departDate && reservation.departHour && reservation.returnHour) {
              const [day, month, year] = reservation.departDate.split('-').map(part => parseInt(part));
              const departureDate = new Date(year, month - 1, day);
  
              this.equipmentsWithDate.push({
                equipmentId: equipmentId, // Utilisez la variable temporaire qui est garantie d'être un number
                departureDate: departureDate,
                departureHour: reservation.departHour,
                returnHour: reservation.returnHour,
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
    this.equipmentService.getAllEquipments().subscribe((equipement: Equipments[]) => {
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

    
  console.log("eeee");
  console.log(this.tableauResultat);
  console.log(this.equipments);
      // Parcourir chaque élément de tableauResultat
      this.equipmentsWithDate.forEach(element => {
        // Extraire l'ID de l'équipement
        const equipmentId = element.equipmentId;

        // Vérifier si l'ID de l'équipement est défini
        if (equipmentId !== null) {
          const date = element.departureDate;
          const departureTime = element.departureHour;
          const returnTime = element.returnHour;
  
          // Rechercher les données de l'équipement correspondant à cet ID, à cette date et à cette heure
          const equipmentDataForId = this.equipments.find(equipment => equipment.id === equipmentId );
  console.log(equipmentDataForId);
          // Vérifier si des données ont été trouvées
          if (equipmentDataForId) {
            equipmentDataForId.returned = "returned";
            equipmentDataForId.taken = "Not taken";
            equipmentDataForId.reservation_State = "Reserved";
            // Ajouter les données trouvées au tableau final
            this.FinalEquipmentData.push({
              equipmentId: equipmentId,
              date: date,
              departureTime: departureTime,
              returnTime: returnTime,
              equipmentData: equipmentDataForId
            });
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
  // Stockez la nouvelle valeur avec le nom du champ modifié
  console.log('Nouvelle valeur de', fieldName, ':', newValue);

  // Désactiver les autres champs si la condition est remplie
  if (fieldName === 'maintenance_status' && ['under maintenance', 'Damaged'].includes(newValue)) {
    this.disableReservationState = true;
    this.disableReturned = true;
    this.disableTaken = true;
  
    this.FinalEquipmentData.forEach((equipmentData: any) => {
      if (equipmentData.equipmentData && equipmentData.equipmentData.taken &&equipmentData.equipmentData.returned) {
        equipmentData.equipmentData.taken="Not taken";
        equipmentData.equipmentData.returned="returned";
    
        equipmentData.equipmentData.reservation_State = 'Not yet';
      const occupiedValue = equipmentData.equipmentData.reservation_State;
        //console.log('Occupied value:', occupiedValue);
       
      }
    });

  } else if (fieldName === 'state' && newValue === 'Disabled') {
    this.disableReservationState = true;
    this.disableReturned = true;
    this.disableTaken = true;
   // equipmentData.equipmentData.reservation_State="Not yet";
    

   
    
  } else {
    // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
    this.disableReservationState = false;
    this.disableReturned = false;
    this.disableTaken = false;
   
  }

  // Vous pouvez stocker la nouvelle valeur dans un objet ou un tableau selon vos besoins
}

// Définir des variables de contrôle pour activer ou désactiver l'édition des champs
performAction(equipement: any) {
  // Afficher une alerte de confirmation
  const confirmation = window.confirm("Are you sure you want to perform this action?");

  // Vérifier si l'utilisateur a confirmé
  if (confirmation) { 
 
    // Vérifier si les champs Maintenance Status et Equipment State ont les valeurs nécessaires pour désactiver les autres champs
    if (
      (equipement.equipmentData.maintenance_status === 'Damaged' || equipement.equipmentData.maintenance_status === 'under maintenance') &&
      equipement.equipmentData.state === 'Disabled'
    ) {
      // Désactiver les autres champs
      this.disableReservationState = true;
      this.disableReturned = true;
      this.disableTaken = true;
      equipement.equipmentData.reservation_State = 'Not yet';
    
    } else {
      // Activer tous les champs s'ils ne correspondent pas aux conditions de désactivation
      this.disableReservationState = false;
      this.disableReturned = false;
      this.disableTaken = false;
      
    }
    const roomIdToUpdate = equipement.equipmentId;
    const index = this.FinalEquipmentData.findIndex((e: any) => e.equipmentId === equipement.equipmentId);
    console.log("equipement.equipmentData.reservation_State ",equipement.equipmentData.reservation_State );
    if (equipement.equipmentData.reservation_State === 'Not yet') {
      // Stocker l'ID de la salle dans une variable
     
      console.log('ID de la equip à mettre à jour:', roomIdToUpdate);


      // Supprimer les réservations associées à cette salle
      this.reservationService.getAllReservations().subscribe(
       
        (reservations: any[]) => {
          // Parcourir toutes les réservations
          reservations.forEach((reservation: any) => {
            console.log("rrrrrrrrr",reservation.equipmentId, roomIdToUpdate);
            // Vérifier si la réservation a le même rooms_id que roomIdToUpdate
            if (reservation.equipmentsId === roomIdToUpdate) {
              console.log("'''''''''");
              // Supprimer la réservation
              this.reservationService.deleteReservation(reservation.id).subscribe(
                () => {
                
                  console.log('La réservation associée à la equip a été supprimée avec succès.');
                  this.sendEmail();
                  // Mettez ici le code pour gérer l'action pour l'équipement spécifique
                  console.log("Action performed for equipment:", equipement);
                }
              );
            }
          });
        }
      );
    }  
    const equipData = equipement.equipmentData.taken;    
   
    const heure1=equipement.departureTime;
    console.log("date1",heure1)
    const heure2=equipement.returnTime  ;
    console.log("date1",heure2)
    const departureDate = formatDateToString(equipement.date);
    console.log("depature date ",departureDate)
    // Vérifier et mettre à jour le Benefit State si taken ou returned
    if (equipData === 'taken' || equipData=== 'Returned') {
      console.log("equipData.taken",equipData)

      this.reservationService.getAllReservations().subscribe((reservations: any[]) => {
        reservations.forEach((reservation: any) => {
          if (reservation.equipmentsId === roomIdToUpdate && reservation.departHour === heure1 && reservation.returnHour === heure2 && reservation.departDate === departureDate) {
            if (equipData === 'taken') {
              reservation.benefit_status = 'taken';
            } else if (equipData === 'Returned') {
              reservation.benefit_status = 'returned';
            }

            this.reservationService.updateReservation(reservation.id, { benefit_status: reservation.benefit_status }).subscribe(() => {
              console.log(`Benefit State updated for reservation ${reservation.id}`);
            }, error => {
              console.error(`Error updating Benefit State for reservation ${reservation.id}`, error);
            });
          }
        });
      });
    }
    // Mettez ici le code pour gérer l'action pour l'équipement spécifique
    console.log("Action performed for equipment:", equipement);
console.log("---------",this.donneesEquipements);
    // Trouver l'index de l'équipement dans donneesEquipements
  

    // Vérifier si l'index est valide
    if (index !== -1) {
      // Stocker l'ID de l'équipement
      const equipmentId = equipement.equipmentId;

      // Stocker les caractéristiques modifiées
      const modifiedCharacteristics = {
        // Ajoutez ici les caractéristiques modifiées que vous souhaitez stocker
        // Par exemple, si vous souhaitez stocker la quantité modifiée
        quantity: equipement.equipmentData.quantity,
        maintenance_status: equipement.equipmentData.maintenance_status,
        reservation_State: equipement.equipmentData.reservation_State,
        state: equipement.equipmentData.state,
        
        // Ajoutez d'autres caractéristiques modifiées si nécessaire
      };


      console.log("ID de l'équipement modifié:", equipmentId);
      console.log("Caractéristiques modifiées:", modifiedCharacteristics);

      // Effectuez la mise à jour de l'équipement
      this.equipmentService.editEquipments(equipement.equipmentId, equipement.equipmentData).subscribe(response => {
        console.log('Mise à jour réussie', response);
      }, error => {
        console.error('Erreur lors de la mise à jour', error);
      });
    } else {
      console.error("ID d'équipement non trouvé dans donneesEquipements.");
    }
  } else {
    // Afficher un message d'annulation
    console.log("L'exécution de l'action a été annulée.");
  }
}


updateFreeField(newValue: string, equipmentData: any) {
  if (newValue === 'taken') {
      equipmentData.equipmentData.returned = 'Not returned';
  } else {
      equipmentData.equipmentData.returned = 'returned';
  }
}

updateOccupiedField(newValue: string, equipmentData: any) {
  if (newValue === 'returned') {
      equipmentData.equipmentData.taken = 'Not taken';
  } else {
      equipmentData.equipmentData.taken = 'taken';
  }
}


}

function formatDateToString(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}