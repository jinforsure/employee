import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reservation } from 'src/app/private/model/reservation';
import { ReservationService } from 'src/app/private/services/reservation.service';
import { EmailService } from 'src/app/private/services/email.service';
import { NotifService, AppNotification } from 'src/app/private/services/notif.service';
import { EmployeeService } from 'src/app/private/services/employee.service';
import { Employee } from 'src/app/private/model/employee';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {
  email: string | null = localStorage.getItem('email');
  username = localStorage.getItem('username');
  reservation: Reservation = { username: '', name: '', category: '', subCategory: '', departDate: '', departHour: '', returnHour: '', state: '' };
  reservationId: string | null = null;
  state: string | null = null;
  notifications: AppNotification[] = [];
  updatedState: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AuthModalComponent>,
    private reservationService: ReservationService,
    public emailService: EmailService,
    private notifService: NotifService,
    private employeeService: EmployeeService
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.state = this.data.state;
    this.reservationId = this.data.reservationId;
    this.updatedState = this.state; 
    console.log("State on init: ", this.state);
    console.log("Reservation ID on init: ", this.reservationId);
    console.log("updatedState on init: ", this.updatedState);
  }

  sendEmail(to: string[], cc: string[], subject: string, body: string): void {
    this.emailService.sendEmail(to, cc, subject, body).subscribe(
      response => {
        console.log('Email sent successfully', response);
        const newNotification: AppNotification = {
          date_envoi: new Date().toISOString().split('T')[0],
          heure: new Date().toLocaleTimeString(),
          type: 'Email',
          titre: subject,
          message: body
        };
        this.notifService.addNotification(newNotification).subscribe(
          notifResponse => {
            console.log('Notification stored successfully', notifResponse);
            this.notifications.push(notifResponse);
          },
          notifError => {
            console.error('Error storing notification', notifError);
          }
        );
      },
      error => {
        console.error('Error sending email', error);
      }
    );
}


  saveEmployee(): void {
    const reservationId = this.data.reservationId;
    console.log("Employee 1: ", reservationId);
    if (reservationId) {
      this.updateEmployee(reservationId);
    }
  }

  onStateChange(event: any): void {
    this.updatedState = event.target.value;
    this.state = this.updatedState;  // Sync state with updatedState
    console.log("updatedState after change: ", this.updatedState);
  }

  // Function to reload the page
  reloadPage(): void {
    window.location.reload();
  }

  updateEmployee(id: number) {
    // Récupérer les détails de la réservation à partir de son ID
    this.reservationService.getReservationById(id).subscribe((res) => {
      this.reservation = res;
  
      // Récupérer le nom d'utilisateur associé à la réservation
      const username = this.reservation.username;
  
      // Récupérer tous les employés
      this.employeeService.getAllEmployee().subscribe((employees: Employee[]) => {
        // Trouver l'employé avec le bon nom d'utilisateur
        const employee = employees.find((emp) => emp.username === username);
  
        if (employee) {
          // Récupérer l'e-mail uniquement si l'employé est trouvé
          const email = employee.email;
          console.log("email : ", email);
          // Vérifier si l'e-mail est défini avant de l'utiliser
          if (email) {
            // Déterminer l'e-mail à envoyer en fonction de l'état de la réservation
            let subject = '';
            let body = '';
            console.log("updatedState before email: ", this.updatedState);
            switch (this.updatedState) {
              case 'Reserved':
                subject = "Reservation Confirmation";
                body = `Dear ${employee.username},\nYour Reservation has been successfully updated.\nBest regards,\nAdmin`;
                break;
              case 'Cancelled':
                subject = "Reservation Cancellation";
                body = `Dear ${employee.username},\nYour Reservation has been cancelled.\nBest regards,\nAdmin`;
                break;
              case 'On Hold':
                subject = "Reservation On Hold";
                body = `Dear ${employee.username},\nYour Reservation is currently on hold.\nBest regards,\nAdmin`;
                break;
              default:
                subject = "Reservation Update";
                body = `Dear ${employee.username},\nYour Reservation status is now ${this.updatedState}.\nBest regards,\nAdmin`;
                break;
            }
  
            // Envoyer l'e-mail si le sujet et le corps sont définis
            if (subject && body) {
              const to: string[] = [email];
              const cc: string[] = [email];
  
              this.emailService.sendEmail(to, cc, subject, body).subscribe(
                (response) => {
                  console.log('Email sent successfully', response);
                },
                (error) => {
                  console.error('Error sending email', error);
                }
              );
            } else {
              console.error("Invalid state for sending email:", this.updatedState);
            }
          } else {
            console.error("Email not found for employee:", username);
          }
        } else {
          console.error("Employee not found for username:", username);
        }
      });
    });
  
    // Update the state of the reservation
    this.reservation.state = this.updatedState!;
  
    this.reservationService.editReservation(id, this.reservation).subscribe((res) => {
      console.log(res);
      this.reloadPage(); // Reload the page after updating reservation
    });
  
    // Fermer le modal
    this.dialogRef.close();
  }
}
