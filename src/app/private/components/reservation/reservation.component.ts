import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EquipmentsService } from '../../services/equipments.service';
import { RoomsService } from '../../services/rooms.service';
import { Equipments } from '../../model/equipments';
import { Rooms } from '../../model/rooms';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { ActivatedRoute, Params, Router } from '@angular/router';



@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit{

  equipmentsList: Equipments[] =[];
  roomsList: Rooms[] =[];
  isButtonEnabled: boolean = false;
  selectedDate: string='';
  selectedDepartureTime: string = '';
  selectedReturnTime: string = '';
  name: [] = [];


  updateButtonState() {
    this.isButtonEnabled = this.equipmentsList.some(equipment => equipment.checked) || this.roomsList.some(room => room.checked);
  }

  constructor(
    private equipmentsService: EquipmentsService,
    private roomsService : RoomsService,
    private reservationService : ReservationService,
    private router : Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedDate = params['date'];
      this.selectedDepartureTime = params['departureTime'];
      this.selectedReturnTime = params['returnTime'];
  
      if (this.selectedDate !== undefined && this.selectedDepartureTime !== undefined && this.selectedReturnTime !== undefined) {
        this.loadReservations();
      } else {
        console.error('Selected date, departure time, or return time is undefined.');
      }
    });
  
    this.displayEquipments();
    this.displayRooms();
  }
  

  displayEquipments() {
    this.equipmentsService.getAllEquipments().subscribe((res) => {
      this.equipmentsList = res;
      console.log(res);
    });
  }

  displayRooms() {
    this.roomsService.getAllRooms().subscribe((res) => {
      this.roomsList = res;
      console.log(res);
    });
  }
  

  loadReservations(): void {
    console.log('Selected date:', this.selectedDate);
    console.log('Selected departure time:', this.selectedDepartureTime);
    console.log('Selected return time:', this.selectedReturnTime);
  
    this.reservationService.getReservationByDateAndTimeWithEquipments(this.selectedDate, this.selectedDepartureTime, this.selectedReturnTime)
      .subscribe((reservationsWithEquipments: Reservation[]) => {
        console.log('Reservations with equipment:', reservationsWithEquipments);
      }, (error) => {
        console.error('Error fetching reservations with equipment:', error);
      });
  
    this.reservationService.getReservationByDateAndTimeWithRooms(this.selectedDate, this.selectedDepartureTime, this.selectedReturnTime)
      .subscribe((reservationsWithRooms: Reservation[]) => {
        console.log('Reservations with rooms:', reservationsWithRooms);
      }, (error) => {
        console.error('Error fetching reservations with rooms:', error);
      });
  }
  

}