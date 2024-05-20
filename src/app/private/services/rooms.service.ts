import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rooms } from '../model/rooms';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  baseUrl = 'http://localhost:8083/api/arsii';
  private roomsUrl = this.baseUrl + '/rooms'; 

  constructor(private httpclient: HttpClient) { }

  getAllRooms(){
    return this.httpclient.get<Rooms[]>(this.baseUrl+'/rooms');
  }
  getRoomsById(id : number){
    return this.httpclient.get<Rooms>(this.baseUrl + '/rooms/' +id );
  }
  getRoomsTypes(): Observable<string[]> {
    return this.httpclient.get<Rooms[]>(this.roomsUrl).pipe(
      map(rooms => rooms
        // Filtrer les objets où type n'est pas undefined
        .filter(room => room.type !== undefined)
        // Mapper pour obtenir seulement la propriété type
        .map(room => room.type as string)
        // Utiliser un Set pour éliminer les doublons et convertir en tableau
        .reduce((uniqueTypes, type) => uniqueTypes.includes(type) ? uniqueTypes : [...uniqueTypes, type], [] as string[])
      )
    );
  }

  addRooms(rooms : Rooms) {
    return this.httpclient.post(this.baseUrl + '/rooms',rooms);
  }

  editRooms(id: number,rooms:Rooms){
    return this.httpclient.put(this.baseUrl + '/rooms/' + id, rooms);
  }
  
}
