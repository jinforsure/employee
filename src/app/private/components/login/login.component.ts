import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import du service d'authentification

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, // Injection du service d'authentification
              private router: Router) { }

  login() {
    console.log(this.email);
    console.log(this.password);

    this.authService.login(this.email, this.password).subscribe(
      (resultData: any) => {
        console.log(resultData);
        if (resultData.message === 'login success') {
          const userRole = this.authService.getUserRole();
          if (userRole === 'admin') {
            this.router.navigateByUrl('/dashboard'); // Rediriger vers le tableau de bord de l'admin
          } else if (userRole === 'employee') {
            this.router.navigateByUrl('/calendar'); // Rediriger vers le calendrier de l'employé
          } else {
            alert('Unknown user role'); // Rôle utilisateur inconnu
          }
        } else {
          alert('Failed to login'); // Échec de la connexion
        }
      },
      (error) => {
        console.error('An error occurred:', error); // Gérer les erreurs
        alert('Failed to login');
      }
    );
  }
}
