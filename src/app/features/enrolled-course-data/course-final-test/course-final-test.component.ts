import { AuthService } from './../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseDataService } from '../../../core/services/course-data.service';

@Component({
  selector: 'app-course-final-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-final-test.component.html',
  styleUrls: ['./course-final-test.component.css'],
})
export class CourseFinalTestComponent implements OnInit {
  courseId: string = '';
  finalTestUrl: string | null = null;
  selectedFile: File | null = null;
  isUploading: boolean = false;
  isLoadingFinalTest = false;
  showMessage: boolean = false;
  message: any = '';
  isPassed: boolean = false;

  private _ActivatedRoute = inject(ActivatedRoute);
  private _CourseDataService = inject(CourseDataService);

  ngOnInit(): void {
    this.courseId = this._ActivatedRoute.snapshot.params['id'];
    this.loadFinalTest();
  }

  loadFinalTest() {
    this.isLoadingFinalTest = true;
  
    this._CourseDataService.downloadCourseFinalTest(this.courseId).subscribe({
      next: (res: Blob) => {
        if (res && res.size > 0) {
          const blob = new Blob([res], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob); 
          this.finalTestUrl = url;
          this.isPassed = true;
        } else {
          this.finalTestUrl = null;
          this.isPassed = false;
        }
  
        this.isLoadingFinalTest = false;
      },
      error: (err) => {
        console.log(err);
        this.finalTestUrl = null;
        this.isPassed = false;
        this.isLoadingFinalTest = false;
        this.message = err.error?.message || 'Error loading final test.';
        this.showNotification(this.message, false);
      },
    });
  }
  
  DownloadFinalTest() {
    this._CourseDataService.downloadCourseFinalTest(this.courseId).subscribe({
      next: (blob: Blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'final-test.pdf';
        link.click();
        URL.revokeObjectURL(link.href);
      },
      error: (err) => {
        console.error('Error downloading file:', err);
        this.showNotification('Error downloading final test.', false);
      },
    });
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onFileUpload() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('finalTestFile', this.selectedFile);

    this._CourseDataService.uploadFinalTest(this.courseId, formData).subscribe({
      next: () => {
        this.showNotification('Answer submitted successfully!');
        this.selectedFile = null;
        this.isUploading = false;
      },
      error: (err) => {
        console.error('Error uploading file:', err);
        const errorMessage = err.error?.message || 'Error uploading file. Please try again.';
        this.showNotification(errorMessage, false);
        this.isUploading = false;
      },
    });
  }

  showNotification(message: string, isSuccess: boolean = true) {
    this.message = message;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 4000);
  }
}
