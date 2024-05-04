import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../private/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Vérifier si l'utilisateur est connecté et s'il a le rôle d'administrateur
    if (this.authService.isLoggedIn() && this.authService.getUserRole() === 'admin') {
      return true; // Autoriser l'accès à la route
    } else {
      // Rediriger vers une page d'erreur ou une autre page
      this.router.navigate(['/login']);
      return false; // Interdire l'accès à la route
    }
  }
}
