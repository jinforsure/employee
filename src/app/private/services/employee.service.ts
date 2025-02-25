import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';
import { Observable } from 'rxjs';
import { PasswordReset } from '../model/PasswordReset';
import { PasswordResetConfirm } from '../model/PasswordResetConfirm';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = 'http://localhost:8083/api/arsii';

  constructor(private httpclient: HttpClient) { }

  getAllEmployee(){
    return this.httpclient.get<Employee[]>(this.baseUrl+'/employee');
  }

  deleteEmployee(id: number){
    return this.httpclient.delete(this.baseUrl+'/employee/' + id);
  }

  addEmployee(employee : Employee) {
    return this.httpclient.post(this.baseUrl + '/employee',employee);
  }

  editEmployee(id: number,employee:Employee){
    return this.httpclient.put(this.baseUrl + '/employee/' + id, employee);
  }

  getEmployeeById(id : number){
    return this.httpclient.get<Employee>(this.baseUrl + '/employee/' +id );
  }
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password }; 
    return this.httpclient.post<any>(`${this.baseUrl}/employee/login`, loginData);
  }
  
  getEmployeeByEmail(email: string): Observable<Employee> {
    return this.httpclient.get<Employee>(`${this.baseUrl}/employee/email/${email}`);
  }

  changePassword(email: string, currentPassword: string, newPassword: string): Observable<any> {
    let params = new HttpParams()
      .set('email', email)
      .set('currentPassword', currentPassword)
      .set('newPassword', newPassword);

    return this.httpclient.post(`${this.baseUrl}/employee/change-password`, {}, { params, responseType: 'text' });
  }

  resetPassword(data: { email: string }): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}/employee/reset-password`, data, { responseType: 'text' });
  }

  resetPasswordConfirm(data: PasswordResetConfirm): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}/employee/reset-password/confirm`, data, { responseType: 'text' });
  }

}
