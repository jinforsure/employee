import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface AppNotification {
  id?: number;
  date_envoi: string;
  heure: string;
  type: string;
  titre: string;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class NotifService {
  private apiUrl = 'http://localhost:8083/api/arsii/notif';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.apiUrl);
  }

   // Nouvelle méthode pour enregistrer une notification
   addNotification(notification: AppNotification): Observable<AppNotification> {
    return this.http.post<AppNotification>(this.apiUrl, notification);
  }
}
