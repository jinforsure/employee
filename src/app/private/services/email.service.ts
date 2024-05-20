import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  //baseUrl = 'http://localhost:8083/api/arsii';

  

  private apiUrl = 'http://localhost:8083/api/arsii/mail/send'; // Adjust URL if needed

  constructor(private http: HttpClient) { }

  sendEmail(to: string[], cc: string[], subject: string, body: string): Observable<any> {
    let params = new HttpParams();
    to.forEach(email => params = params.append('to', email));
    cc.forEach(email => params = params.append('cc', email));
    params = params.append('subject', subject);
    params = params.append('body', body);

    return this.http.post(this.apiUrl, {}, { params ,responseType:'text'});
  }

  





}
