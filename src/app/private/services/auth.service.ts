import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password }; 
    return this.http.post<any>('http://localhost:8083/api/arsii/employee/login', loginData)
      .pipe(
        tap(result => {
          if (result.message === 'login success') {
            this.loggedIn.next(true);
            // Appel à la méthode du service Employee pour récupérer les détails de l'employé
            this.getEmployeeDetails(email).subscribe(employee => {
              localStorage.setItem('account_type', employee.account_type);
              localStorage.setItem('id', employee.id);
              localStorage.setItem('username', employee.username);
              console.log("24",employee.account_type);
            });
          }
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn.next(false);
    console.log("fel logout auth");
  }

  private getEmployeeDetails(email: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8083/api/arsii/employee/email/${email}`);
  }
  getRole(): string | null {
    // Récupérez l'account_type du stockage local
    return localStorage.getItem('account_type');
  }
}
