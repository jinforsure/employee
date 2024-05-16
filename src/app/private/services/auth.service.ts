import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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
            // Call the method to fetch employee details
            this.getEmployeeDetails(email).subscribe(employee => {
              if (employee.state === 'Active') {
                // If employee state is 'Active', proceed with login
                this.loggedIn.next(true);
                localStorage.setItem('account_type', employee.account_type);
                localStorage.setItem('id', employee.id);
                localStorage.setItem('username', employee.username);
                console.log("24", employee.account_type);
              } else {
                // If employee state is 'Inactive', prevent login
                // Clear any previous authentication state
                this.loggedIn.next(false);
                localStorage.clear();
              }
            });
          }
        }),
        catchError(error => {
          // Handle any errors
          console.error('Error during login:', error);
          // Clear any previous authentication state
          this.loggedIn.next(false);
          localStorage.clear();
          // Rethrow the error to propagate it further
          throw error;
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn.next(false);
    console.log("Logged out");
  }

  private getEmployeeDetails(email: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8083/api/arsii/employee/email/${email}`);
  }

  getRole(): string | null {
    // Retrieve the account_type from local storage
    return localStorage.getItem('account_type');
  }
}
