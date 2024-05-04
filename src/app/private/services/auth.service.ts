import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  // Méthode pour connecter l'utilisateur
  login(email: string, password: string): Observable<any> {
    // Appel à votre API d'authentification
    return this.http.post<any>('/api/login', { email, password });
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    // Nettoyage des informations d'authentification
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Méthode pour récupérer le rôle de l'utilisateur
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = this.decodeToken(token);
        return decodedToken.role || ''; // Renvoyer une chaîne vide si le rôle est absent
    }
    return null; // Renvoyer null si aucun token n'est disponible
}


  // Méthode utilitaire pour décoder un token JWT
  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }
}
