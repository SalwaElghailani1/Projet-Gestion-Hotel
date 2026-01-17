import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgFor,
    NgIf,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  navItems = [
    { name: 'Home', active: false },
    { name: 'About', active: false },
    { name: 'Rooms', active: false },
    { name: 'Contact', active: false }
  ];

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onNavItemClick(item: any, event: Event) {
    event.preventDefault();
    this.navItems.forEach(i => i.active = false);
    item.active = true;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) return;

    this.isLoading = true;
    this.error = '';

    this.authService.register(this.firstName, this.lastName, this.email, this.password).subscribe({
      next: () => {
        this.authService.login(this.email, this.password).subscribe({
          next: (res) => {
            this.router.navigate(['/login']); // user redirected
          },
          error: (err) => this.error = 'Login failed after registration'
        });
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) this.error = 'Email already in use';
        else if (err.status === 400) this.error = 'Invalid data';
        else this.error = 'Server error, please try again';
      }
    });

  }


  onGoogleLogin() { console.log('Google register'); }
  onFacebookLogin() { console.log('Facebook register'); }

  onSignUp(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
