import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { PasswordResetConfirm } from '../../model/PasswordResetConfirm';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';

  message: string = '';
  isSuccess: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  resetPassword() {
    const passwordReset: PasswordResetConfirm = {
      token: this.token,
      newPassword: this.newPassword
    };

    this.employeeService.resetPasswordConfirm(passwordReset).subscribe(
      response => {
        this.isSuccess = true;
        this.message = 'Your password has been successfully changed';
        
        // Wait for 3 seconds before reloading and navigating
        setTimeout(() => {
          //window.location.reload();
          this.router.navigate(['/login']);
        }, 3000);
      },
      error => {
        this.isSuccess = false;
        this.message = 'Password reset failed. Please try again.';
      }
    );
  }
}
