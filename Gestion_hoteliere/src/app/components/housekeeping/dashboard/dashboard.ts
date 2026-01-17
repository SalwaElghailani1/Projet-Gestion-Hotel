import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HousekeepingService, Room, Task } from '../../../services/housekeeping.service';
import { AuthService } from '../../../services/auth.service';
import { UserProfileService } from '../../../services/user-profile.service';

@Component({
  selector: 'app-housekeeping-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class HousekeepingDashboardComponent implements OnInit {

  rooms: Room[] = [];
  tasks: Task[] = [];
  notifications: any[] = []; // Ajouté

  filteredRooms: Room[] = [];
  filteredTasks: Task[] = [];

  filterStatus: string = 'all';
  taskFilter: string = 'all';

  activeSection: string = 'profile';

  userName: string = '';
  userId!: number;

  profileForm!: FormGroup;
  message: string = '';
  unreadNotifications: number = 0; // Ajouté

  // DEBUG: Pour voir ce qui se passe
  debugInfo: string = '';

  constructor(
    private housekeepingService: HousekeepingService,
    private authService: AuthService,
    private profileService: UserProfileService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.userId = this.authService.getUserId();

    this.initProfileForm();
    this.loadProfile();
    this.loadRooms();
    this.loadMyTasks();
    this.loadNotifications(); // Ajouté
  }

  // ================= PROFILE =================

  initProfileForm(): void {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      cne: ['', Validators.required]
    });
  }

  loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: profile => {
        this.profileForm.patchValue(profile);
        this.userName = profile.nom + ' ' + profile.prenom;
      },
      error: err => console.error('Erreur load profile', err)
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.profileService.updateMyProfile(this.profileForm.value).subscribe({
      next: updated => {
        this.message = '✅ Profil mis à jour avec succès!';
        this.userName = updated.nom + ' ' + updated.prenom;
        setTimeout(() => this.message = '', 3000);
      },
      error: err => {
        console.error(err);
        this.message = '❌ Erreur lors de la mise à jour!';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  cancelEdit(): void {
    this.loadProfile();
    this.message = 'Modifications annulées';
    setTimeout(() => this.message = '', 2000);
  }

  deleteAccount(): void {

  }

  // ================= NOTIFICATIONS =================

  loadNotifications(): void {
    // Simuler des notifications (à remplacer par un vrai service)
    this.notifications = [
      {
        title: 'Nouvelle tâche assignée',
        message: 'Vous avez une nouvelle tâche de nettoyage pour la chambre 101',
        time: 'Il y a 10 minutes',
        read: false
      },
      {
        title: 'Tâche terminée',
        message: 'La chambre 203 a été nettoyée avec succès',
        time: 'Il y a 1 heure',
        read: true
      },
      {
        title: 'Rappel',
        message: 'N\'oubliez pas de vérifier les produits de nettoyage',
        time: 'Il y a 3 heures',
        read: true
      }
    ];

    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
    this.unreadNotifications = 0;
  }

  toggleRead(notification: any): void {
    notification.read = !notification.read;
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  // ================= DASHBOARD STATS =================

  get cleaningRoomsCount(): number {
    return this.rooms.filter(r => this.normalizeEtat(r.etat) === 'nettoyage').length;
  }

  get completedTasksCount(): number {
    return this.tasks.filter(t => t.status === 'completed').length;
  }

  get roomStatusStats() {
    const total = this.rooms.length || 1;

    const stats = [
      { key: 'libre', label: 'disponible' },
      { key: 'occupée', label: 'occupée' },
      { key: 'maintenance', label: 'maintenance' },
      { key: 'nettoyage', label: 'à nettoyer' }
    ];

    return stats.map(stat => {
      const count = this.rooms.filter(r =>
        this.normalizeEtat(r.etat) === stat.key
      ).length;

      return {
        label: stat.label,
        count,
        percentage: Math.round((count / total) * 100)
      };
    });
  }

  // ================= LOAD DATA =================

  loadRooms(): void {
    this.debugInfo = 'Chargement des chambres...';

    this.housekeepingService.getAllRooms().subscribe({
      next: rooms => {
        console.log('=== CHAMBRES CHARGÉES ===');
        console.log('Total:', rooms.length);

        const etatsUniques = [...new Set(rooms.map(r => r.etat))];
        console.log('États uniques trouvés:', etatsUniques);

        etatsUniques.forEach(etat => {
          const count = rooms.filter(r => r.etat === etat).length;
          console.log(`- ${etat}: ${count} chambre(s)`);
        });

        this.rooms = rooms;
        this.filterRooms();

        this.debugInfo = `Chargé: ${rooms.length} chambres | États: ${etatsUniques.join(', ')}`;
      },
      error: err => {
        console.error('Erreur chargement chambres:', err);
        this.debugInfo = '❌ Erreur de chargement';
      }
    });
  }

  loadMyTasks(): void {
    this.housekeepingService.getMyTasks(this.userId).subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.filterTasks();
      },
      error: err => console.error('Erreur chargement tâches:', err)
    });
  }

  // ================= FILTERS =================

  normalizeEtat(etat: string): string {
    if (!etat) return '';

    let normalized = etat.toLowerCase().trim();

    if (normalized.includes('libre') || normalized.includes('disponible')) {
      return 'libre';
    }

    if (normalized.includes('occupé') || normalized.includes('occupée')) {
      return 'occupée';
    }

    if (normalized.includes('maintenance')) {
      return 'maintenance';
    }

    if (normalized.includes('nettoyage')) {
      return 'nettoyage';
    }

    return normalized;
  }

  filterRooms(): void {
    console.log('=== FILTRAGE ===');
    console.log('Filtre sélectionné:', this.filterStatus);
    console.log('Total chambres:', this.rooms.length);

    if (this.filterStatus === 'all') {
      this.filteredRooms = this.rooms;
    } else {
      const filterEtat = this.normalizeEtat(this.filterStatus);
      console.log('Filtre normalisé:', filterEtat);

      this.filteredRooms = this.rooms.filter(room => {
        const roomEtat = this.normalizeEtat(room.etat);
        const match = roomEtat === filterEtat;

        if (match) {
          console.log(`✓ Match: Chambre ${room.numero} - état: ${room.etat} -> normalisé: ${roomEtat}`);
        }

        return match;
      });
    }

    console.log('Chambres filtrées:', this.filteredRooms.length);
    console.log('Détails:', this.filteredRooms.map(r => `${r.numero} (${r.etat})`));
  }

  filterTasks(): void {
    this.filteredTasks =
      this.taskFilter === 'all'
        ? this.tasks
        : this.tasks.filter(t => t.status === this.taskFilter);
  }

  // ================= TASK ACTIONS =================

  createCleaningTask(room: Room): void {
    const task: Task = {
      chambreId: room.id,
      description: `Nettoyage de la chambre ${room.numero}`,
      status: 'pending',
      assignedTo: this.userId,
      priority: 'medium'
    };

    this.housekeepingService.createTask(task).subscribe({
      next: newTask => {
        this.tasks.push(newTask);
        this.filterTasks();
        this.updateRoomStatus(room.id, 'nettoyage');

        // Ajouter une notification
        this.notifications.unshift({
          title: 'Tâche créée',
          message: `Nouvelle tâche de nettoyage pour la chambre ${room.numero}`,
          time: 'À l\'instant',
          read: false
        });
        this.unreadNotifications++;
      },
      error: err => console.error('Erreur création task', err)
    });
  }

  updateRoomStatus(roomId: number, status: string): void {
    this.housekeepingService.updateRoomStatus(roomId, status).subscribe({
      next: updatedRoom => {
        const i = this.rooms.findIndex(r => r.id === roomId);
        if (i !== -1) {
          this.rooms[i] = updatedRoom;
          this.filterRooms();
        }
      },
      error: err => console.error('Erreur mise à jour statut chambre:', err)
    });
  }

  replaceTask(updated: Task): void {
    const index = this.tasks.findIndex(t => t.id === updated.id);
    if (index !== -1) {
      this.tasks[index] = updated;
      this.filterTasks();
    }
  }

  startTask(taskId: number): void {
    this.housekeepingService.updateTaskStatus(taskId, 'in_progress')
      .subscribe(updated => {
        this.replaceTask(updated);
      });
  }

  completeTask(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    this.housekeepingService.updateTaskStatus(taskId, 'completed')
      .subscribe(updated => {
        this.replaceTask(updated);
        this.updateRoomStatus(task.chambreId, 'libre');

        // Ajouter une notification
        this.notifications.unshift({
          title: 'Tâche terminée',
          message: `Tâche de nettoyage pour la chambre ${task.chambreId} terminée`,
          time: 'À l\'instant',
          read: false
        });
        this.unreadNotifications++;
      });
  }

  // ================= UI =================

  getStatusLabel(status: string): string {
    const normalized = this.normalizeEtat(status);

    const labels: { [key: string]: string } = {
      'libre': 'Disponible',
      'disponible': 'Disponible',
      'occupée': 'Occupée',
      'occupé': 'Occupée',
      'maintenance': 'Maintenance',
      'nettoyage': 'À nettoyer',
      'pending': 'En attente',
      'in_progress': 'En cours',
      'completed': 'Terminée'
    };

    return labels[normalized] || status;
  }

  showFilterDetails(): void {
    console.log('=== DÉTAILS DU FILTRE ===');
    console.log('Filtre actuel:', this.filterStatus);
    console.log('Normalisé:', this.normalizeEtat(this.filterStatus));

    this.rooms.forEach(room => {
      console.log(`Chambre ${room.numero}: ${room.etat} -> ${this.normalizeEtat(room.etat)}`);
    });

    alert(`Détails dans la console (F12)\nFiltre: ${this.filterStatus}\nChambres filtrées: ${this.filteredRooms.length}`);
  }

  showSection(section: string): void {
    this.activeSection = section;
  }

  viewRoomDetails(room: Room): void {
    console.log('Détails chambre:', room);
    alert(`Chambre #${room.numero}\nType: ${room.type}\nÉtat: ${room.etat}\nPrix: ${room.prix} MAD`);
  }

  viewTaskDetails(task: Task): void {
    console.log('Détails tâche:', task);
    alert(`Tâche #${task.id}\nChambre: ${task.chambreId}\nStatut: ${task.status}\nPriorité: ${task.priority}\n${task.description}`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
