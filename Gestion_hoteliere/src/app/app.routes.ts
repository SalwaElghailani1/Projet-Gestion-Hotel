import { Routes } from '@angular/router';

import { HomeComponent } from './home/home';
import { LoginComponent } from './login.component/login.component';
import { Register } from './register/register';
import { Catalogue } from './catalogue/catalogue';
import { ProfileComponent } from './components/client/profil-client/profil-client';
import { ProfilManager } from './components/manager/profil-manager/profil-manager';
import { RoomDetails } from './room-details/room-details';
import { AdminGuard } from './guards/admin.guard';
import {Payment} from './payment/payment';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'catalogue', component: Catalogue },
  { path: 'catalogue/profil', component: ProfileComponent },
  { path: 'room/:id/profil', component: ProfileComponent },
  { path: 'room/:id', component: RoomDetails },
  { path: 'profil/payment', component: Payment },

  // Manager
  {
    path: 'manager',
    loadComponent: () =>
      import('./components/manager/profil-manager/profil-manager')
        .then(m => m.ProfilManager)
  },

  // Reception
  {
    path: 'reception',
    loadComponent: () =>
      import('./components/reception-profile/reception-profile')
        .then(m => m.ReceptionProfile)
  },

  // Housekeeping
  {
    path: 'housekeeping',
    loadComponent: () =>
      import('./components/housekeeping/dashboard/dashboard')
        .then(m => m.HousekeepingDashboardComponent)
  },

  // Admin (protected)
  // Admin (protected)
{
  path: 'admin',
  loadComponent: () => import('./admin/admin').then(m => m.Admin),
  canActivate: [AdminGuard],
  children: [
    {
      path: 'users',
      loadComponent: () =>
        import('./admin/user-list/user-list')
          .then(m => m.UserListComponent)
    },
    {
      path: 'users/edit/:id',
      loadComponent: () =>
        import('./admin/edit-user/edit-user')
          .then(m => m.EditUserComponent)
    },
    {
      path: 'users/add',
      loadComponent: () =>
        import('./admin/add-user/add-user')
          .then(m => m.AddUserComponent)
    },
    {
      path: 'roles',
      loadComponent: () =>
        import('./admin/roles/roles')
          .then(m => m.RolesComponent)
    },
    {
      path: 'profile',
      loadComponent: () =>
        import('./admin/admin-profile/admin-profile')
          .then(m => m.AdminProfileComponent)
    },
    {
      path: 'room-stats',
      loadComponent: () =>
        import('./admin/room-stats/room-stats')
          .then(m => m.RoomStats)
    },
    {
     path: 'reservation',
    loadComponent: () =>
     import('./admin/reservation/reservation')
      .then(m => m.ReservationComponent)
}

  ]
},


  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./components/unauthorized/unauthorized')
        .then(m => m.UnauthorizedComponent)
  },

  { path: '**', redirectTo: '' }
];
