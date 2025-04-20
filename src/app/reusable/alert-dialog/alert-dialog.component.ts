import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';

interface DialogData {
  message: string;
  icon?: string;
  title?: string;
  actions: DialogAction[];
}

interface DialogAction {
  text: string;
  value: any;
  color?: 'primary' | 'accent' | 'warn';
  type?: 'basic' | 'raised' | 'stroked' | 'flat';
}

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, NgIf, NgFor],
  template: `
    <div class="dialog-container p-6">
      <div *ngIf="data.icon" class="dialog-icon mb-4 text-center">
        <mat-icon [class]="getIconClass()">{{
          data.icon.toLowerCase()
        }}</mat-icon>
      </div>

      <div
        *ngIf="data.title"
        class="dialog-title mb-3 text-xl font-semibold text-center"
      >
        {{ data.title }}
      </div>

      <div class="dialog-content mb-6 text-center">
        <p>{{ data.message }}</p>
      </div>

      <div class="dialog-actions flex justify-center gap-3">
        <ng-container *ngFor="let action of data.actions">
          <button
            *ngIf="action.type === 'basic'"
            mat-button
            [color]="action.color"
            (click)="onAction(action.value)"
          >
            {{ action.text }}
          </button>

          <button
            *ngIf="action.type === 'raised'"
            mat-raised-button
            [color]="action.color"
            (click)="onAction(action.value)"
          >
            {{ action.text }}
          </button>

          <button
            *ngIf="action.type === 'stroked'"
            mat-stroked-button
            [color]="action.color"
            (click)="onAction(action.value)"
          >
            {{ action.text }}
          </button>

          <button
            *ngIf="action.type === 'flat'"
            mat-flat-button
            [color]="action.color"
            (click)="onAction(action.value)"
          >
            {{ action.text }}
          </button>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow: hidden; /* Prevents scrollbars */
        height: 300px; /* Full height to avoid scrolling */
      }

      .dialog-icon mat-icon {
        transform: scale(2);
        width: 48px;
        height: 48px;
      }

      .dialog-title {
        margin-bottom: 1rem;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .dialog-content p {
        margin-bottom: 1.5rem;
      }

      .dialog-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }

      button {
        min-width: 100px; /* Optional for button size consistency */
      }

      .warning-icon {
        color: #f44336;
      }
      .info-icon {
        color: #2196f3;
      }
      .success-icon {
        color: #4caf50;
      }
      .question-icon {
        color: #ff9800;
      }
    `,
  ],
})
export class AlertDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) {
    // Set default actions if none provided
    if (!this.data.actions || this.data.actions.length === 0) {
      this.data.actions = [
        {
          text: 'OK',
          value: true,
          type: 'basic',
        },
      ];
    }
  }

  getIconClass(): string {
    switch (this.data.icon?.toLowerCase()) {
      case 'warning':
        return 'warning-icon';
      case 'info':
        return 'info-icon';
      case 'success':
        return 'success-icon';
      case 'help':
        return 'question-icon';
      default:
        return '';
    }
  }

  onAction(value: any): void {
    this.dialogRef.close(value);
  }
}
