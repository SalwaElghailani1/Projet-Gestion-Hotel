import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RoomService } from '../../services/room.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-room-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgChartsModule],
  templateUrl: './room-stats.html',
  styleUrls: ['./room-stats.css']
})
export class RoomStats implements OnInit {

  loading = true;

  stats = {
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    singleRooms: 0,
    doubleRooms: 0,
    suiteRooms: 0,
    averagePrice: 0
  };

  // Chart pour répartition des types de chambres
  roomTypeChartData: ChartData<'doughnut'> = {
    labels: ['Simples', 'Doubles', 'Suites'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#9c27b0', '#2196f3', '#009688'],
    }]
  };

  roomTypeChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Répartition par type de chambre' }
    }
  };

  // Chart pour disponibilité
  roomAvailabilityChartData: ChartData<'bar'> = {
    labels: ['Disponibles', 'Occupées', 'Maintenance'],
    datasets: [{
      label: 'Nombre de chambres',
      data: [0, 0, 0],
      backgroundColor: ['#4caf50', '#f44336', '#ff9800']
    }]
  };

  roomAvailabilityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.roomService.getRoomStats().subscribe({
      next: (data: any) => {
        this.stats = data;
        this.loading = false;

        // MAJ chart data
        this.roomTypeChartData.datasets[0].data = [
          this.stats.singleRooms,
          this.stats.doubleRooms,
          this.stats.suiteRooms
        ];

        this.roomAvailabilityChartData.datasets[0].data = [
          this.stats.availableRooms,
          this.stats.occupiedRooms,
          this.stats.maintenanceRooms
        ];
      },
      error: (err: any) => {
        console.error('Erreur stats rooms:', err);
        this.loading = false;
      }
    });
  }

}
