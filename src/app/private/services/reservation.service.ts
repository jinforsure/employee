import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../model/reservation';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  checkedItems: any[] = [];
  reservationState: any[] = [];
  private addMoreClickedSubject = new Subject<void>();

  private reservationStateSubject = new BehaviorSubject<any[]>([]);

  baseUrl = 'http://localhost:8083/api/arsii';

  constructor(private httpclient: HttpClient) { }


  sendAddMoreClicked(): void {
    console.log("Send add more clicked");
    this.addMoreClickedSubject.next();
  }

  // Observable pour écouter le message "Add more clicked"
  getAddMoreClicked(): Observable<void> {
    console.log("add more  ");
    return this.addMoreClickedSubject.asObservable();
  }
 

  getReservationState(): Observable<any[]> {
    return this.reservationStateSubject.asObservable();
  }

storeReservationState(state: any[]): void {
  this.reservationStateSubject.next(state);
}



  getAllReservations(){
    return this.httpclient.get<Reservation[]>(this.baseUrl+'/reservation');
  }


  deleteReservation(id: number){
    return this.httpclient.delete(this.baseUrl+'/reservation/' + id);
  }

  addReservation(reservation : Reservation) {
    return this.httpclient.post(this.baseUrl + '/reservation',reservation);
  }

  updateReservation(id: number,reservation:Reservation){
    return this.httpclient.put(this.baseUrl + '/reservation/' + id, reservation);
  }

  getReservationById(id : number){
    return this.httpclient.get<Reservation>(this.baseUrl + '/reservation/' +id );
  }
  
  getAllReservationsWithEquipments(){
    return this.httpclient.get<Reservation[]>(this.baseUrl+'/getWithEquipments');
  }
  getAllReservationsWithRooms(){
    return this.httpclient.get<Reservation[]>(this.baseUrl+'/getWithRooms');
  }
  
  addReservationWithEquipments(reservation : Reservation) {
    return this.httpclient.post(this.baseUrl + '/with-equipments',reservation);
  }
  addReservationWithRooms(reservation : Reservation) {
    return this.httpclient.post(this.baseUrl + '/with-rooms',reservation);
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
  getReservationsByDepartureDate(departureDate: string): Observable<Reservation[]> {
    const url = `${this.baseUrl}/reservation?departureDate=${departureDate}`;
    return this.httpclient.get<Reservation[]>(url);
  }  
}
