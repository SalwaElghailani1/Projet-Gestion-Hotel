import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {RoomService} from '../services/room.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  isLoading = false;
  error = '';

  // Navigation du site
  navItems = [
    { name: 'Home', active: false },
    { name: 'About', active: false },
    { name: 'Rooms', active: false },
    { name: 'Contact', active: false }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onNavItemClick(item: any, event: Event) {
    event.preventDefault();
    this.navItems.forEach(i => i.active = false);
    item.active = true;
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    alert('Mot de passe oublié cliqué !');
  }

  onSignUp(event: Event) {
    event.preventDefault();
    this.router.navigate(['/register']); //route register here
  }

  onGoogleLogin() {
    alert('Connexion Google cliquée !');
  }

  onFacebookLogin() {
    alert('Connexion Facebook cliquée !');
  }

  async onSubmit() {
    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {

        this.isLoading = false;

         if (response.roles?.includes('ADMIN')) this.router.navigate(['/admin']);

        else if (response.roles?.includes('MANAGER')) this.router.navigate(['/manager']);
         else if (response.roles?.includes('RECEPTIONNISTE')) this.router.navigate(['/reception']);
        else if (response.roles?.includes('CLIENT')) this.router.navigate(['/catalogue']);
        else if (response.roles?.includes('HOUSEKEEPING')) this.router.navigate(['/housekeeping']);
        else this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) this.error = 'Email ou mot de passe incorrect';
        else if (err.status === 0) this.error = 'Impossible de se connecter au serveur. Assurez-vous que Spring Boot est actif';
        else this.error = 'Une erreur est survenue. Veuillez réessayer';
      }
    });
  }



}
