import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string = '';
  isSuccess: boolean = true;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.employeeService.resetPassword(this.forgotPasswordForm.value).subscribe(
        response => {
          if (this.forgotPasswordForm.valid === true){
          console.log('Success response:', response);
          this.isSuccess = true;
          this.message = 'Password reset link sent to your email.';}
          else {
            this.isSuccess = false;
          this.message = 'Email does not exist';
          }
        },
        error => {
          console.log('Error response:', error);
          this.isSuccess = false;
          this.message = 'Error sending password reset link. Please try again.';
        }
      );
    }
  }
  
}
