import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from 'express';
import { AlertService } from '../../services/AlertService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards',
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  constructor(private router: Router,private http: HttpClient, private alert: AlertService,@Inject(PLATFORM_ID) private platformId: Object) {}

  token = localStorage.getItem('token')?.toString() || '';
  businessCardsData: any[] = [];
  
  onCardTap(card: any): void {
    this.alert
      .openDeleteDialog('Are you sure you want to delete this card?')
      .subscribe((confirmed) => {
        if (confirmed) {
          const url = `https://localhost:7137/api/BusinessCard/${card.id}`;
          this.http
            .delete(url, {
              headers: new HttpHeaders({
                'Authorization': `Bearer ${this.token}`
              })
            })
            .subscribe({
              next: () => {
                this.businessCardsData = this.businessCardsData.filter(
                  (c) => c.id !== card.id
                );
                this.alert.openAlertDialogAsync('Card deleted successfully');
              },
              error: (err) => {
                console.error('Error deleting card:', err);
                this.alert.openAlertDialogAsync('Failed to delete card. Try again?');
              }
            });
        }
      });
  }
}
