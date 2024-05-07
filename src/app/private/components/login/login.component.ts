import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { HtmlParser } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private employeeService: EmployeeService,
              private router: Router) { }

  login() {
    console.log(this.email);
    console.log(this.password);

    this.authService.login(this.email, this.password).subscribe((resultData: any) => {
      console.log(resultData);

      if (resultData.message == "email does not match") {
        alert("email does not match");
      } else if (resultData.message == "login success") {
        this.employeeService.getEmployeeByEmail(this.email).subscribe((employeeData: any) => {
          console.log("Account Type:", employeeData.account_type);
          if (employeeData.account_type === "Employee"){
            this.router.navigateByUrl('/calendar');
          } else if (employeeData.account_type === "Admin"){
            this.router.navigateByUrl('/dashboard');
            console.log("dashboard");
          } else {
            alert("Unknown account type");
          }
        });
      } else {
        alert("failed to login");
      }
    });
  }
}