import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipments } from '../model/equipments';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService {
  baseUrl = 'http://localhost:8083/api/arsii';
  private equipmentsUrl = this.baseUrl + '/equipments'; 

  constructor(private httpclient: HttpClient) { }

  getAllEquipments(){
    return this.httpclient.get<Equipments[]>(this.baseUrl+'/equipments');
  }
  getEquipmentsById(id : number){
    return this.httpclient.get<Equipments>(this.baseUrl + '/equipments/' +id );
  }
    // Méthode pour récupérer uniquement les types d'équipements
    getEquipmentTypes(): Observable<string[]> {
      return this.httpclient.get<Equipments[]>(this.equipmentsUrl).pipe(
        map(equipments => equipments
          // Filtrer les objets où type n'est pas undefined
          .filter(equipment => equipment.type !== undefined)
          // Mapper pour obtenir seulement la propriété type
          .map(equipment => equipment.type as string)
          // Utiliser un Set pour éliminer les doublons et convertir en tableau
          .reduce((uniqueTypes, type) => uniqueTypes.includes(type) ? uniqueTypes : [...uniqueTypes, type], [] as string[])
        )
      );
    }
}
