import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';
import { Observable } from 'rxjs';

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
}
