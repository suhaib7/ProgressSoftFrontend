import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertService } from '../../services/AlertService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BusinessCardModel } from '../../model/BusinessCardModel';

@Component({
  selector: 'app-file-import',
  imports: [CommonModule],
  templateUrl: './file-import.component.html',
  styleUrl: './file-import.component.css'
})
export class FileImportComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFiles: { name: string; size: number }[] = [];
  showModal: boolean = false;
  businessCards: BusinessCardModel[] = [];
  isLoading: boolean = false;
  token: string = '';

  constructor(
    private alertService: AlertService,
    private http: HttpClient
  ) {
    // Get token from localStorage
    this.token = localStorage.getItem('token')?.toString() || '';
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;

    const allowedExtensions = ['csv', 'xml'];
    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension || !allowedExtensions.includes(extension)) {
        this.alertService.openAlertDialogAsync(`File "${file.name}" is not supported. Only CSV and XML allowed.`);
        return; // stop further processing
      }

      this.selectedFiles.push({ name: file.name, size: file.size });
    }

    // If we have valid files, process them
    if (this.selectedFiles.length) {
      this.processFiles(files);
    }
  }

  processFiles(files: FileList): void {
    this.isLoading = true;
    const formData = new FormData();
    
    // Append the first file (we only process one file at a time)
    formData.append('file', files[0]);

    this.http.post<BusinessCardModel[]>(
      'https://localhost:7137/api/BusinessCard/ProcessFile',
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`
        })
      }
    ).subscribe({
      next: (response) => {
        this.businessCards = response;
        this.showModal = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.alertService.openAlertDialogAsync('Error processing file. Please try again.');
        this.isLoading = false;
        console.error('Error processing file:', error);
      }
    });
  }

  importCards(): void {
    if (this.selectedFiles.length === 0) {
      this.closeModal();
      return;
    }
    
    this.isLoading = true;
    const formData = new FormData();
    
    // Get the original file from the input element
    const files = this.fileInput.nativeElement.files;
    if (!files || files.length === 0) {
      this.alertService.openAlertDialogAsync('No file selected for import.');
      this.isLoading = false;
      return;
    }
    
    formData.append('file', files[0]);

    this.http.post(
      'https://localhost:7137/api/BusinessCard/import',
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`
        })
      }
    ).subscribe({
      next: () => {
        this.alertService.openAlertDialogAsync('Business cards imported successfully!');
        this.closeModal();
        this.isLoading = false;
        // You may want to emit an event to refresh the parent component
      },
      error: (error) => {
        this.alertService.openAlertDialogAsync('Error importing business cards. Please try again.');
        this.isLoading = false;
        console.error('Error importing cards:', error);
      }
    });
  }

  formatFileSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }

    return `${size.toFixed(2)} ${units[index]}`;
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.selectedFiles.length === 0) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.businessCards = [];
    this.fileInput.nativeElement.value = '';
  }
}