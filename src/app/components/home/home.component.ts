import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AlertService } from '../../services/AlertService';
import { BusinessCardModel } from '../../model/BusinessCardModel';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FileImportComponent } from '../file-import/file-import.component';
import { FormsModule } from '@angular/forms';

interface FilterParams {
  name: string | null;
  gender: string | null;
  dob: string | null;
  email: string | null;
  phone: string | null;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FileImportComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [AlertService],
  standalone: true,
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private alert: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  businessCardsData: BusinessCardModel[] = [];
  token = '';
  filters: FilterParams = {
    name: null,
    gender: null,
    dob: null,
    email: null,
    phone: null
  };
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token')?.toString() || '';
    }
    this.loadBusinessCards();
  }

  loadBusinessCards(): void {
    // Create HTTP params from filters
    let params = new HttpParams();
    if (this.filters.name) params = params.set('name', this.filters.name);
    if (this.filters.gender) params = params.set('gender', this.filters.gender);
    if (this.filters.dob) params = params.set('dob', this.filters.dob);
    if (this.filters.email) params = params.set('email', this.filters.email);
    if (this.filters.phone) params = params.set('phone', this.filters.phone);

    this.http
      .get<BusinessCardModel[]>(
        'https://localhost:7137/api/BusinessCard/GetAll',
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
          }),
          params: params
        }
      )
      .subscribe({
        next: (res: any) => {
          this.businessCardsData = res;
        },
        error: (err) => {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.alert.openAlertDialogAsync('Failed to load business cards.');
          }
        },
      });
  }

  applyFilters(): void {
    this.loadBusinessCards();
  }

  resetFilters(): void {
    this.filters = {
      name: null,
      gender: null,
      dob: null,
      email: null,
      phone: null
    };
    this.loadBusinessCards();
  }

  onCardTap(card: any): void {
    this.alert
      .openDeleteDialog('Are you sure you want to delete this card?')
      .subscribe((confirmed) => {
        if (confirmed) {
          const url = `https://localhost:7137/api/BusinessCard/${card.id}`;
          this.http
            .delete(url, {
              headers: new HttpHeaders({
                Authorization: `Bearer ${this.token}`,
              }),
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
                this.alert.openAlertDialogAsync(
                  'Failed to delete card. Try again?'
                );
              },
            });
        }
      });
  }
}