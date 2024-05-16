import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';
import { EditRoomsModalComponent } from './edit-rooms-modal/edit-rooms-modal.component';
import { AddRoomsModalComponent } from './add-rooms-modal/add-rooms-modal.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {
  roomsList: Rooms[] =[];
  searchText: string ='';
  filteredRoomsList: Rooms[] = [];
  constructor(
    private roomsService: RoomsService,private dialog: MatDialog 
  ){}
  ngOnInit(): void {
    this.displayRooms();
  }

  displayRooms() {
    this.roomsService.getAllRooms().subscribe((res) => {
      this.roomsList = res;
      this.filteredRoomsList=res;
      console.log(res);
    });
  }
  
  search(): void {
    // Filtrer la liste d'employés en fonction du texte de recherche
    if (this.searchText.trim() === '') {
      // Si le champ de recherche est vide, réinitialiser filteredEmployeeList avec employeeList
      this.filteredRoomsList = this.roomsList;
    } else {
      // Sinon, appliquer la recherche normalement
      this.filteredRoomsList = this.roomsList.filter(room => {
        // Vérifier si employee.firstName, employee.lastName et employee.email ne sont pas undefined
        const location = room.location ? room.location.toLowerCase() : '';
        const name = room.name ? room.name.toLowerCase() : '';
        const reserved=room.reservation_State? room.reservation_State.toLowerCase():'';
        const free=room.free? room.free.toLowerCase():'';
        const occupied=room.occupied? room.occupied.toLowerCase():'';
        const type = room.type ? room.type.toLowerCase() : '';
    
        // Rechercher le texte dans firstName, lastName et email
        return (
          location.includes(this.searchText.toLowerCase()) ||
          name.includes(this.searchText.toLowerCase()) ||
          free.includes(this.searchText.toLowerCase()) ||
          occupied.includes(this.searchText.toLowerCase()) ||
          reserved.includes(this.searchText.toLowerCase()) ||
          type.includes(this.searchText.toLowerCase())
        );
      });
    }console.log('Filtered equipment List:', this.filteredRoomsList);
  }
  

openAddRoomsModal(): void {
  const dialogRef = this.dialog.open(AddRoomsModalComponent, {
    width: '500px',
    // Add any other configuration options here
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Add logic to handle modal close if needed
  });
}


openAddEditRoomsModal(roomsId :any, Rooms: any): void {
  const dialogRef = this.dialog.open(EditRoomsModalComponent, {
    width: '500px',
    data: { roomsId, Rooms
     }
  });
  console.log("room : ",Rooms);
  console.log("roomsId id: ",roomsId);
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Handle any necessary actions after the modal is closed
  });
}

}
