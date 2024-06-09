import { Component, OnDestroy } from '@angular/core';
import { BenefitComponent } from '../benefit/benefit.component';
import { EquipmentsService } from '../../services/equipments.service';
import { RoomsService } from '../../services/rooms.service';
import { Equipments } from '../../model/equipments';
import { Rooms } from '../../model/rooms';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailsModalComponent } from '../benefit/equipments/details-modal/details-modal.component';
@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {

  searchText: string = '';
equipmentsList: Equipments[] =[];
  roomsList: Rooms[] =[];
  equipmentTypes: string[] = [];
  roomsTypes: string[] = [];

  reservations: Reservation[] = [];
  
  isButtonEnabled: boolean = false;
  selectedCategory: string = '';
  subcategories: string[] = [];
  
  selectedSubcategory: string = '';


  equipments: any = { checked: false }; // Initialisation à false
  checkedItems: any[] = [];
  rooms: any = { checked: false };

  filteredEquipmentsList: Equipments[] = [];
  filteredRoomsList: Rooms[] = [];



  availableEquipments:Equipments[]=[];
  availableRooms:Rooms[]=[];
  selectedDate: string='';
  selectedDepartureTime: string = '';
  selectedReturnTime: string = '';
  departureDatesList:{ equipmentsId: number | undefined; roomsId: number | undefined }[] = [];
  private addMoreClickedSubscription: Subscription = new Subscription();
  equipmentsId:number=0;
  roomsId:number=0;
  originalFilteredEquipmentsList: Equipments[] = [];
  updateButtonState() {
    this.isButtonEnabled = this.equipmentsList.some(equipment => equipment.checked) || this.roomsList.some(room => room.checked);
  }

  title = 'myangularproject';
  constructor(public dialog: MatDialog,
    private equipmentsService: EquipmentsService,
    private roomsService : RoomsService,
    private router : Router,
    private reservationService : ReservationService,
    private route: ActivatedRoute,
    
  ){}

  reservationState: any[] = [];
  
  ngOnInit(): void {
    console.log('ouiiiiiiii');
   
    console.log(this.filteredEquipmentsList);
    console.log(this.filteredRoomsList);

    this.reservationService.getReservationState().subscribe((data: any[]) => {
        if (data && data.length > 0) {
          this.isButtonEnabled = true;
          this.equipments.checked=true;
          this.rooms.checked=true;
            this.reservationState = data;
            this.selectedDate = data[0].selectedDate;
            console.log("trah 2",this.selectedDate);
            this.selectedDepartureTime = data[0].selectedDepartureDate;
            this.selectedReturnTime = data[0].selectedReturnTime;
            console.log("trah2",data[0]);
            console.log("trah2",this.selectedReturnTime);
            // Vérifiez si les listes d'équipements et de chambres sont disponibles
            if (data[0].filteredEquipmentsList && data[0].filteredRoomsList) {
                this.filteredEquipmentsList = data[0].filteredEquipmentsList;
                this.filteredRoomsList = data[0].filteredRoomsList;

                console.log("Liste des équipements filtrés:", this.filteredEquipmentsList);
                console.log("Liste des chambres filtrées:", this.filteredRoomsList);
            } else {
              
                console.error("Les données d'état ne contiennent pas les listes attendues.");
            }

            console.log("État de réservation mis à jour:", data);
        } else {
          this.isButtonEnabled = true;
          this.equipments.checked=true;
                  this.rooms.checked=true;
            // Vérifiez les paramètres de la requête
            this.route.queryParams.subscribe((params: Params) => {
                this.selectedDate = params['date'];
                this.selectedDepartureTime = params['departureTime'];
                this.selectedReturnTime = params['returnTime'];
                
                console.log('Selected date:', this.selectedDate);
                console.log('Selected departure time:', this.selectedDepartureTime);
                console.log('Selected return time:', this.selectedReturnTime);
        
                // Vérifiez si la date de départ est définie
                if (this.selectedDate && this.selectedDepartureTime && this.selectedReturnTime) {
                  console.log("trah",this.selectedDate);
                  console.log("trah",this.selectedDepartureTime);
                  console.log("trah",this.selectedReturnTime);
                    // Si la date de départ est définie, chargez les réservations correspondantes
                    this.loadReservationsByDepartureDate(this.selectedDate, this.selectedDepartureTime, this.selectedReturnTime);
                }
                else {//ici par defautttt 
                
                  this.displayEquipments();
                  this.displayRooms();
                 // this.filterBySearchText();
                  this.isButtonEnabled = false;
                  this.equipments.checked=false;
                  this.rooms.checked=false;
                }
            });
        }
    });

}



filterBySearchText(): void {
  if (this.selectedDate) {
    this.filterEquipmentsBySearchText();
  } else {
    this.filterroomsBySearchText();
  }
}

// hedhy metmechich maa ili par defaut 
filterEquipmentsBySearchText(): void {
  // Si le champ de recherche n'est pas vide
  if (this.searchText.trim() !== '') {
    console.log('Available Rooms:', this.availableRooms);
    // Filtrer la liste en fonction du texte de recherche
    this.filteredEquipmentsList = this.availableEquipments.filter(equipment =>
      (equipment.name && equipment.name.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (equipment.category && equipment.category.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (equipment.type && equipment.type.toLowerCase().includes(this.searchText.toLowerCase()))
    );
    this.filteredRoomsList = this.availableRooms.filter(rooms =>
      (rooms.name && rooms.name.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (rooms.category && rooms.category.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (rooms.type && rooms.type.toLowerCase().includes(this.searchText.toLowerCase()))
    );

  } else {
    // lezm hne taarf chethot
    this.filteredEquipmentsList = this.availableEquipments;
    this.filteredRoomsList=this.availableRooms;
  }
}

filterroomsBySearchText(): void {
  // Si le champ de recherche n'est pas vide
  if (this.searchText.trim() !== '') {
    // Filtrer la liste en fonction du texte de recherche
    this.filteredEquipmentsList = this.equipmentsList.filter(equipment =>
      (equipment.name && equipment.name.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (equipment.category && equipment.category.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (equipment.type && equipment.type.toLowerCase().includes(this.searchText.toLowerCase()))
    );
    this.filteredRoomsList = this.roomsList.filter(rooms =>
      (rooms.name && rooms.name.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (rooms.category && rooms.category.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (rooms.type && rooms.type.toLowerCase().includes(this.searchText.toLowerCase()))
    );

  } else {
    // lezm hne taarf chethot
    this.filteredEquipmentsList = this.equipmentsList;
    this.filteredRoomsList=this.roomsList;
  }
}

chooseDateFirst(): void {
  this.router.navigate(['/calendar']);

}

  onCheckboxChange(event: any, item: any, selectedDate: string, selectedDepartureTime: string, selectedReturnTime: string) {
    console.log('Checkbox état:', event.checked ? 'coché' : 'non coché');
  
    if (event.checked) {
      // Désélectionner toutes les autres chambres dans la liste et les retirer de checkedItems
      this.filteredRoomsList.forEach(room => {
        if (room !== item && room.checked) {
          room.checked = false;
          const index = this.reservationService.checkedItems.findIndex(x => x.id === room.id);
          if (index !== -1) {
            this.reservationService.checkedItems.splice(index, 1);
          }
        }
      });
  
      // Ajouter la chambre sélectionnée à checkedItems
      const newItem = {
        ...item,
        selectedDate: selectedDate,
        selectedDepartureTime: selectedDepartureTime,
        selectedReturnTime: selectedReturnTime
      };//iciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
      console.log('checkedItems ye tas ', newItem);
      this.reservationService.checkedItems.push(newItem);
    } else {
      // Supprimer la chambre désélectionnée de checkedItems
      const index = this.reservationService.checkedItems.findIndex(x => x.id === item.id);
      if (index !== -1) {
        this.reservationService.checkedItems.splice(index, 1);
      }
    }
  }
  
  onSubmit() {
    if (!this.reservationService.checkedItems.length) {
     
      window.alert("No items checked. Please check at least one item to proceed.");
      return; // Arrête l'exécution si aucun élément n'est coché
    }
    // Stockez l'état actuel du tableau avant de naviguer vers la page de liste
    const currentState: { filteredEquipmentsList: Equipments[]; filteredRoomsList: Rooms[] ;selectedDate:String;selectedDepartureDate:String;selectedReturnTime:String}[] = [
      {
        filteredEquipmentsList: this.filteredEquipmentsList,
        filteredRoomsList: this.filteredRoomsList,
        selectedDate:this.selectedDate,
        selectedDepartureDate:this.selectedDepartureTime,
        selectedReturnTime:this.selectedReturnTime
      }
      
    ];
  
  // Enregistrez les éléments cochés et les réservations actuelles
  const selectedDate = this.selectedDate;
  const selectedDepartureTime = this.selectedDepartureTime;
  const selectedReturnTime = this.selectedReturnTime;
  const checkedItems = this.reservationService.checkedItems;
  console.log("check check",this.reservationService.checkedItems);
  console.log("ya date ",this.selectedDate);
  console.log("ya date ",this.selectedDepartureTime);

  console.log("ya date ",this.selectedReturnTime);
 // Cochez les éléments correspondants dans filteredEquipmentsList et filteredRoomsList
 checkedItems.forEach(item => {
  if (item.category === 'Equipments') {
    const equipment = this.filteredEquipmentsList.find(e => e.id === item.id);
    if (equipment) {
      equipment.checked = true;
    }
  } else if (item.category === 'Rooms') {
    const room = this.filteredRoomsList.find(r => r.id === item.id);
    if (room) {
      room.checked = true;
    }
  }
});
currentState.push({
  filteredEquipmentsList: this.filteredEquipmentsList,
  filteredRoomsList:this.filteredRoomsList,
  selectedDate:this.selectedDate,
  selectedDepartureDate:this.selectedDepartureTime,
  selectedReturnTime:this.selectedReturnTime
});
console.log("w fi current famechy date ",currentState);
// Stockez l'état actuel dans le service de réservation
  this.reservationService.storeReservationState(currentState);

    this.router.navigateByUrl('reservation/list');
  }



  initializeDefaultLists(): void {
    this.filteredEquipmentsList = this.availableEquipments;
    this.filteredRoomsList = this.availableRooms;
  }
  loadReservationsByDepartureDate(selectedDate: string,selectedDepartureTime: string, selectedReturnTime: string): void {
    // Initialiser la liste des réservations
   // let reservations: Reservation[] = [];
    this.availableEquipments = [];
    this.availableRooms = [];
  
    // Récupércoer toutes les réservations
    this.reservationService.getAllReservations().subscribe({
        next: (res) => {
            // Remplir la liste des réservations avec les réservations pour la date sélectionnée
            this.reservations = res.filter(reservation =>   reservation.departDate === selectedDate && 
            ( (!reservation.departHour || reservation.departHour <= selectedDepartureTime) || 
            (!reservation.returnHour || reservation.returnHour >= selectedReturnTime)
        )
          );

            // Afficher les réservations récupérées dans la console
            console.log('Reservations for selected date:', this.reservations);

            // Extraire les dates de départ, heures de départ, heures de retour, équipementsId et roomsId de la liste des réservations
            this.departureDatesList = this.extractDepartureDates(this.reservations);
            console.log('in this date  and time : Equipment Id, Room Id List:', this.departureDatesList);

           
            
            // Récupérer et filtrer les équipements disponibles
            this.equipmentsService.getAllEquipments().subscribe(equipments => {
                this.availableEquipments = equipments.filter(equipment =>
                    !this.departureDatesList.some(res => res.equipmentsId === equipment.id)
                );
                console.log('Available Equipments:', this.availableEquipments);
                this.initializeDefaultLists();
                
            });

            // Récupérer et filtrer les chambres disponibles
            this.roomsService.getAllRooms().subscribe(rooms => {
                this.availableRooms = rooms.filter(room =>
                    !this.departureDatesList.some(res => res.roomsId === room.id)
                );
                console.log('Available Rooms:', this.availableRooms);
                this.initializeDefaultLists();
            });
            //ici on appelle la table equipment pour les id dans availbaleequipments et on stocke les details dans filterequipments
        },
        error: (error) => {
            console.error('Erreur lors de la récupération des réservations:', error);
        }
    });
  
}
extractDepartureDates(reservations: Reservation[]): { equipmentsId: number | undefined; roomsId: number | undefined }[] {
   this.departureDatesList;//{ equipmentsId: ; roomsId: number | undefined }[] = [];

  // Parcourir toutes les réservations
  reservations.forEach(reservation => {
    // Vérifier si les identifiants d'équipements et de chambres sont définis et non null
    if (reservation.equipmentsId !== undefined && reservation.roomsId !== undefined) {
      // Ajouter les identifiants d'équipements et de chambres au tableau
      this.departureDatesList.push({
        equipmentsId: reservation.equipmentsId,
        roomsId: reservation.roomsId
      });
    }
  });

  console.log("equi id et room id :", this.departureDatesList);
  // Retourner le tableau de dates de départ avec les identifiants d'équipements et de chambres
  return this.departureDatesList;
}

  
  getEquipmentTypes() {
    this.equipmentsService.getEquipmentTypes().subscribe((res) => {
        this.equipmentTypes = res;
        this.subcategories = res;
        console.log(res);

    });
}
  
  getRoomsTypes() {
    this.roomsService.getRoomsTypes().subscribe((res) => {
      this.roomsTypes = res;
      
      this.subcategories = res; // Mettre à jour les sous-catégories avec les types d'équipement
  
      console.log(res); // Log the retrieved room types to verify data
    });
  }

  displayEquipments() {
    this.equipmentsService.getAllEquipments().subscribe((res) => {
     this.equipmentsList = res;
     this.availableEquipments=res;
      this.filteredEquipmentsList = res;
      console.log(res);
     
    });
  }

  displayRooms() {
    this.roomsService.getAllRooms().subscribe((res) => {
      this.roomsList = res;
      this.availableRooms = res;
      this.filteredRoomsList = res;
      console.log(res);
    });
  }

  result: any;

  onCategoryChange(event: any) {
      console.log('Event:', event); // Vérifiez la structure de l'objet event
      const category = event.target?.value;
      console.log('Selected category:', category); // Vérifiez la valeur de la catégorie sélectionnée
  
      this.selectedCategory = category; // Mettre à jour la variable selectedCategory avec la catégorie sélectionnée
  
      if (category === 'category1') {
          this.getEquipmentTypes(); // Appel de la méthode pour récupérer les types d'équipement
      } else if (category === 'category2') {
          this.getRoomsTypes(); // Appel de la méthode pour récupérer les types de chambre
      } else {
          this.subcategories = []; // Effacer les sous-catégories si aucune catégorie n'est sélectionnée
          this.result = null; // Remettre le résultat à null si aucune catégorie n'est sélectionnée
      }
  }
  
  
  
  
  onSubcategoryChange(event: any) {
    this.selectedSubcategory = event.target.value;
    const selectedCategory = this.selectedCategory;
    
    if (this.selectedCategory === 'category1') {
      // Effectuer la recherche d'équipements basée sur la sous-catégorie sélectionnée
      // Vous pouvez utiliser la variable selectedSubcategory ici pour effectuer la recherche
      
    } else if (this.selectedCategory === 'category2') {
      // Effectuer la recherche de chambres basée sur la sous-catégorie sélectionnée
      // Vous pouvez utiliser la variable selectedSubcategory ici pour effectuer la recherche
    }
    
  }
  
// Déclaration de la propriété filteredRoomsList comme un tableau vide
search() {
  // Réinitialiser les listes des équipements et des chambres filtrées
  this.filteredEquipmentsList = [];
  this.filteredRoomsList = [];
  
  // Récupérez la valeur de la catégorie et de la sous-catégorie sélectionnées
  const selectedCategory = (document.getElementById('category') as HTMLSelectElement).value;
  const selectedSubcategory = (document.getElementById('subcategory') as HTMLSelectElement).value;
  
  // Affichez les valeurs récupérées dans la console
  console.log('Selected Category:', selectedCategory);
  console.log('Selected Subcategory:', selectedSubcategory);

  if (selectedCategory === 'category1') { // 'category1' devrait correspondre à 'Equipments'
    if (selectedSubcategory) {
      // Filtrer les équipements disponibles uniquement si une sous-catégorie est sélectionnée
      this.filteredEquipmentsList = this.availableEquipments.filter(equipment => equipment.type === selectedSubcategory);
    } else {
      // Si aucune sous-catégorie n'est sélectionnée, afficher tous les équipements disponibles
      this.filteredEquipmentsList = this.availableEquipments;
    }
    console.log('filteredEquipmentsList:', this.filteredEquipmentsList);
  } else if (selectedCategory === 'category2') { // 'category2' devrait correspondre à 'Rooms'
    if (selectedSubcategory) {
      // Filtrer les chambres disponibles uniquement si une sous-catégorie est sélectionnée
      this.filteredRoomsList = this.availableRooms.filter(room => room.type === selectedSubcategory);
    } else {
      // Si aucune sous-catégorie n'est sélectionnée, afficher toutes les chambres disponibles
      this.filteredRoomsList = this.availableRooms;
    }
    console.log('filteredRoomsList:', this.filteredRoomsList);
    console.log('availableRooms:', this.availableRooms);
  } else {
    // Si aucune catégorie n'est sélectionnée, afficher les équipements et les chambres disponibles
    this.filteredEquipmentsList = this.availableEquipments;
    this.filteredRoomsList = this.availableRooms;
  }
}

  

  openDetailsModal(item: any) {
    const category = item.category; 
    const dialogRef = this.dialog.open(DetailsModalComponent, {
      width: '250px',
      data: { item: item,itemcategory:category }
    });
  console.log('item',item);
  console.log('item categogry',category);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


 


}
