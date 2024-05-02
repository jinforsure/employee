import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../model/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  baseUrl = 'http://localhost:8083/api/arsii/reservation';

  constructor(private httpclient: HttpClient) { }

  getAllReservationsWithEquipments(){
    return this.httpclient.get<Reservation[]>(this.baseUrl+'/getWithEquipments');
  }
  getAllReservationsWithRooms(){
    return this.httpclient.get<Reservation[]>(this.baseUrl+'/getWithRooms');
  }

  deleteReservation(id: number){
    return this.httpclient.delete(this.baseUrl + id);
  }

  addReservationWithEquipments(reservation : Reservation) {
    return this.httpclient.post(this.baseUrl + '/with-equipments',reservation);
  }
  addReservationWithRooms(reservation : Reservation) {
    return this.httpclient.post(this.baseUrl + '/with-rooms',reservation);
  }

  updateReservation(id: number,reservation:Reservation){
    return this.httpclient.put(this.baseUrl + '/reservation/' + id, reservation);
  }

  getReservationByIdWithEquipments(id : number){
    return this.httpclient.get<Reservation>(this.baseUrl +id+ '/withEquipments/' );
  }
  getReservationByIdWithRooms(id : number){
    return this.httpclient.get<Reservation>(this.baseUrl +id+ '/withRooms/' );
  }

  getReservationWithRooms(id : number){
    return this.httpclient.get<Reservation[]>(this.baseUrl+id + '/rooms');
  }

  getReservationWithEquipments(id : number){
    return this.httpclient.get<Reservation[]>(this.baseUrl+id + '/equipments');
  }

  getReservationByDateAndTimeWithEquipments(departDate :string, departHour :string ,returnHour : string){
    return this.httpclient.get<Reservation[]>(this.baseUrl+'/byDateTimeWithEquipments'+departDate+departHour+returnHour);
  }
  getReservationByDateAndTimeWithRooms(departDate :string, departHour :string ,returnHour : string){
    return this.httpclient.get<Reservation[]>(this.baseUrl+'/byDateTimeWithRooms'+departDate+departHour+returnHour);
  }
}
