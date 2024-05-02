import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Benefit } from '../model/Benefit';

@Injectable({
  providedIn: 'root'
})
export class BenefitService {

  baseUrl = 'http://localhost:8083/api/arsii';

  constructor(private httpclient: HttpClient) { }

  getAllBenefit(){
    return this.httpclient.get<Benefit[]>(this.baseUrl+'/benefit');
  }
  getBenefitById(id : number){
    return this.httpclient.get<Benefit>(this.baseUrl + '/benefit/' +id );
  }
  getBenefitByIdwithEquipments(id : number){
    return this.httpclient.get<Benefit>(this.baseUrl + '/benefit/' +id );
  }
}
