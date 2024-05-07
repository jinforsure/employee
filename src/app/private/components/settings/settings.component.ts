import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showSecuritySection: boolean = true;
  showNotificationsSection: boolean = false;

  toggleSecuritySection() {
    this.showSecuritySection = true;
    this.showNotificationsSection = false;
  }

  toggleNotificationsSection() {
    this.showSecuritySection = false;
    this.showNotificationsSection = true;
  }

}
