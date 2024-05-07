import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    let bodyData = {
      email: email,
      password: password
    };
    console.log("auth service");
    return this.http.post("http://localhost:8083/api/arsii/employee/login", bodyData);

  }
  
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    console.log("isloggedin");
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const tokenParts = token.split('.');
    console.log("isTokenExpired");
    if (tokenParts.length !== 3) {
      return true;
    }
    const payload = JSON.parse(atob(tokenParts[1]));
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate <= new Date();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}