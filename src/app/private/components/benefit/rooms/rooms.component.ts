import { Component } from '@angular/core';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {
  roomsList: Rooms[] =[];
  constructor(
    private roomsService: RoomsService,
  ){}
  ngOnInit(): void {
    this.displayRooms();
  }

  displayRooms() {
    this.roomsService.getAllRooms().subscribe((res) => {
      this.roomsList = res;
      console.log(res);
    });
  }


}
