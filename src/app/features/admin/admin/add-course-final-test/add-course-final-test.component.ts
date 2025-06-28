import { AuthService } from './../../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-course-final-test',
  imports: [CommonModule],
  templateUrl: './add-course-final-test.component.html',
  styleUrl: './add-course-final-test.component.css',
})
export class AddCourseFinalTestComponent implements OnInit {
  constructor(
    private _HttpClient: HttpClient,
    private _AuthService: AuthService
  ) {}
  ngOnInit(): void {
    this.Token = this._AuthService.getToken();
  }
  Token: any;
  isCourseListLoading: boolean = false;
  notificationMessage: string = '';
  IsNotificationVisible: boolean = false;
  isNotificationSuccess: boolean = false;
  isListShown: boolean = false;
  allCourses: any = [];
  selectedCourseForFinalTest: string = 'Choose Course for Final Test';
  selectedCourseForFinalTestId: string | null = null;
  isLoading: boolean = false;
  selectedFinalTestFile: File | null = null;

  getAllcourses() {
    this.isListShown = !this.isListShown;
    this.isCourseListLoading = true;
    return this._HttpClient.get('http://localhost:3000/course/').subscribe({
      next: (res) => {
        this.isNotificationSuccess = true;
        this.notificationMessage = 'Courses Loaded successfully!';
        this.IsNotificationVisible = true;
        setTimeout(() => {
          this.IsNotificationVisible = false;
        }, 3000);
        this.allCourses = res;
        this.isCourseListLoading = false;
      },
      error: (err) => {
        this.isNotificationSuccess = false;

        this.IsNotificationVisible = true;
        this.notificationMessage = 'Error loading courses.';
        setTimeout(() => {
          this.IsNotificationVisible = false;
        }, 3000);
        this.isCourseListLoading = false;
      },
    });
  }
  onFinalTestSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFinalTestFile = input.files[0];
      
    }
  }
  setSelectedCourseForFinalTest(Course: any) {
    this.selectedCourseForFinalTest = Course.title;
    this.selectedCourseForFinalTestId = Course._id;
  }
  AddFinalTest() {
    this.isLoading = true;
    if (
      !this.selectedCourseForFinalTest ||
      !this.selectedCourseForFinalTestId
    ) {
      this.isLoading = false;
      this.notificationMessage = 'Please select a course and a PDF file.';
      this.isNotificationSuccess = false;
      this.IsNotificationVisible = true;
      setTimeout(() => {
        this.IsNotificationVisible = false;
      }, 3000);
      return;
    }

    if (!this.selectedFinalTestFile) {
      this.isLoading = false;
      this.notificationMessage = 'Please select a PDF file.';
      this.isNotificationSuccess = false;
      this.IsNotificationVisible = true;
      setTimeout(() => {
        this.IsNotificationVisible = false;
      }, 3000);
      return;
    }

    // Check if file is PDF
    if (this.selectedFinalTestFile.type !== 'application/pdf') {
      this.isLoading = false;
      this.notificationMessage = 'Only PDF files are allowed.';
      this.isNotificationSuccess = false;
      this.IsNotificationVisible = true;
      setTimeout(() => {
        this.IsNotificationVisible = false;
      }, 3000);
      return;
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );

    const formData = new FormData();
    formData.append('finalTestFile', this.selectedFinalTestFile);

    this._HttpClient
      .post(
        `http://localhost:3000/finalTest/course/${this.selectedCourseForFinalTestId}/create`,
        formData,
        { headers }
      )
      .subscribe({
        next: (res) => {
          this.isLoading=false
          this.isNotificationSuccess = true;
          this.notificationMessage = 'Final test uploaded successfully!';
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
          this.selectedFinalTestFile = null;
        },
        error: (err) => {
          this.isLoading=false
          console.error('Upload error:', err);
          this.isNotificationSuccess = false;
          this.notificationMessage =
            err.error?.message || 'Error uploading final test.';
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
        },
      });
  }

}
