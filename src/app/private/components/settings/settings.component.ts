import { Component, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showSecuritySection: boolean = true;
  showNotificationsSection: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  email: string | null = localStorage.getItem('email'); // Assume email is stored in local storage

  message: string = '';
  isSuccess: boolean = true;

  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef) { }

  toggleSecuritySection() {
    this.showSecuritySection = true;
    this.showNotificationsSection = false;
  }

  toggleNotificationsSection() {
    this.showSecuritySection = false;
    this.showNotificationsSection = true;
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.isSuccess = false;
      this.message = 'New password and confirm password do not match.';
      this.cdr.detectChanges();
      return; // Stop further execution
    }
  
    if (this.email) {
      this.employeeService.changePassword(this.email, this.currentPassword, this.newPassword)
        .subscribe(
          response => {
            console.log('Password changed successfully', response);
            this.isSuccess = true;
            this.message = 'Password changed successfully.';
            this.cdr.detectChanges();
            // Reload window after 3 seconds
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          },
          error => {
            console.error('Failed to change password:', error);
            this.isSuccess = false;
            this.message = 'Failed to change password.';
            this.cdr.detectChanges();
          }
        );
    } else {
      this.isSuccess = false;
      this.message = 'User email not found.';
      this.cdr.detectChanges();
    }
  }
}
