import { AuthService } from './../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private _HttpClient: HttpClient,
    private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.courseId = this._ActivatedRoute.snapshot.params['id'];
    this.loadFinalTest();
  }

  loadFinalTest() {
    this.isLoadingFinalTest = true;
    const token =
      this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this._HttpClient
      .get(`http://localhost:3000/finalTest/course/${this.courseId}/file`, {
        headers,
        responseType: 'blob',
      })
      .subscribe({
        next: (res: Blob) => {
          this.isPassed = true;
          const fileURL = URL.createObjectURL(res);
          this.finalTestUrl = fileURL;
          this.isLoadingFinalTest = false;
        },
        error: (err) => {
          console.log(err);
          this.isPassed=false
          this.isLoadingFinalTest = false;
          this.message = err.error?.message || null;
          this.showNotification(this.message, false);
        },
      });
  }
  DownloadFinalTest() {
    const token =
      this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this._HttpClient
      .get(`http://localhost:3000/finalTest/course/${this.courseId}/file`, {
        headers,
        responseType: 'blob',
      })
      .subscribe({
        next: (res: Blob) => {
          const blob = new Blob([res], { type: res.type });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'final-test.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
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

    const token =this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this._HttpClient
      .post(
        `http://localhost:3000/finalTest/course/${this.courseId}/submit`,
        formData,
        { headers }
      )
      .subscribe({
        next: () => {
          this.showNotification('Answer submitted successfully!');
          this.selectedFile = null;
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Error uploading file:', err);
          const errorMessage =
            err.error?.message || 'Error uploading file. Please try again.';
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
