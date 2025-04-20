// alert.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../reusable/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  openAlertDialogAsync(message: string) {
    setTimeout(() => {
      this.dialog.open(AlertDialogComponent, {
        width: '80%',
        maxWidth: '500px',
        data: {
          message: message,
        },
      });
    }, 200);
  }

  openDeleteDialog(message: string) {
    return this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: message,
        icon: 'warning',
        actions: [
          {
            text: 'Cancel',
            value: false,
            type: 'basic'
          },
          {
            text: 'Delete',
            value: true,
            color: 'warn',
            type: 'raised'
          }
        ]
      }
    }).afterClosed();
  }
}
