import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgChartsModule],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css'],
})
export class ReservationComponent implements OnInit {

  reservations: Reservation[] = [];
  totalRevenue = 0;
  reservationsByType: { [key: string]: number } = {};
  reservationsByStatus: { [key: string]: number } = {};
  reservationsByMonth: { [key: string]: number } = {};

  // Doughnut chart pour type de chambre
  public roleChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#3f51b5', '#ff9800', '#4caf50', '#e91e63', '#00bcd4'],
      hoverOffset: 10
    }]
  };

  // Bar chart pour statut des réservations
  public statusChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Nombre de réservations',
      data: [],
      backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
    }]
  };

  // Line chart pour réservations par mois
  public monthlyChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Réservations',
      data: [],
      borderColor: '#3f51b5',
      backgroundColor: 'rgba(63,81,181,0.2)',
      fill: true,
      tension: 0.3
    }]
  };

  public chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  public statusChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Statut' } },
      y: { beginAtZero: true, title: { display: true, text: 'Nombre' } }
    }
  };

  public monthlyChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: true, position: 'top' } },
    scales: {
      x: { title: { display: true, text: 'Mois' } },
      y: { beginAtZero: true, title: { display: true, text: 'Nombre de réservations' }, ticks: { precision: 0 } }
    }
  };

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: res => {
        this.reservations = res.reservations ?? [];

        // Total revenue
        this.totalRevenue = this.reservations.reduce((sum, r) => sum + Number(r.totalPrix || 0), 0);

        // Nombre de réservations par type
        this.reservationsByType = this.reservations.reduce((acc: { [key: string]: number }, r) => {
          const type = r.typeChambre?.trim() || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        // Nombre de réservations par statut
        this.reservationsByStatus = this.reservations.reduce((acc: { [key: string]: number }, r) => {
          const status = r.statut?.trim() || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // Nombre de réservations par mois
        this.reservationsByMonth = {};
        this.reservations.forEach(r => {
          if (r.dateDebut) {
            const date = new Date(r.dateDebut);
            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // ex: "Jan 2026"
            this.reservationsByMonth[month] = (this.reservationsByMonth[month] || 0) + 1;
          }
        });

        // Mise à jour des charts
        this.roleChartData = {
          labels: Object.keys(this.reservationsByType),
          datasets: [{ data: Object.values(this.reservationsByType), backgroundColor: ['#3f51b5', '#ff9800', '#4caf50', '#e91e63', '#00bcd4'], hoverOffset: 10 }]
        };

        this.statusChartData = {
          labels: Object.keys(this.reservationsByStatus),
          datasets: [{ label: 'Nombre de réservations', data: Object.values(this.reservationsByStatus), backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'] }]
        };

        this.monthlyChartData = {
          labels: Object.keys(this.reservationsByMonth),
          datasets: [{ label: 'Réservations', data: Object.values(this.reservationsByMonth), borderColor: '#3f51b5', backgroundColor: 'rgba(63,81,181,0.2)', fill: true, tension: 0.3 }]
        };
      },
      error: err => console.error(err)
    });
  }
}
