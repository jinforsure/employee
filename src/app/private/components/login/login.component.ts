import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string ='';
  password: string ='';
  errorMessage: string ='';
  account_type: string='';
  
  constructor(private authService: AuthService,
              private router: Router) { }

   login() {
    this.authService.login(this.email, this.password).subscribe(
      result => {
        console.log("resultat",result);
        if (result.message === 'login success') {
          console.log("message",result.message);
          const storedAccountType = localStorage.getItem('account_type');
          console.log("storedAccountType",storedAccountType);
          if (storedAccountType !== null) {
            this.account_type = storedAccountType;
            console.log("account_type",this.account_type);
            if (this.account_type == "Admin"){
              this.router.navigateByUrl('/dashboard');
            } else {
              this.router.navigateByUrl('/calendar');
            }
          }
        } else if (result.message === 'email does not match') {
          alert('Email is incorrect');
        } else if (result.message === 'password not match') {
          alert('Password is incorrect');
        } else {
          alert('Failed to login');
        }
      },
      error => {
        console.error(error);
        this.errorMessage = 'An error occurred while logging in';
      }
    );
  }
}
