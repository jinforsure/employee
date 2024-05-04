import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { HtmlParser } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string ='';
  password: string ='';
  errorMessage: string ='';

  constructor(private employeeService: EmployeeService,
              private router: Router,
             private http: HttpClient) { }

   login() {
      console.log(this.email);
      console.log(this.password);
            
              let bodyData = {
                email: this.email,
                password: this.password
              };
            
              this.http.post("http://localhost:8083/api/arsii/employee/login", bodyData).subscribe((resultData: any) => {
                console.log(resultData);
            
                if (resultData.message == "email does not match") {
                  alert("email does not match");
                } else if (resultData.message == "login success") {
                  // Une fois la connexion réussie, récupérez les informations supplémentaires de l'employé
                  this.employeeService.getEmployeeByEmail(this.email).subscribe((employeeData: any) => {
                    // Vous pouvez accéder aux informations de l'employé ici, par exemple, employeeData.accountType
                    console.log("Account Type:", employeeData.account_type);
                    if (employeeData.account_type === "Employee"){
                      this.router.navigateByUrl('/Calendar');
                    }else if (employeeData.account_type === "Admin"){
                      this.router.navigateByUrl('/dashboard');
                    }else {
                      alert("Unknown account type");
                    }
                  });
                } else {
                  alert("failed to login");
                }
              })
            }
            
}
