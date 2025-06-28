import { AuthService } from './../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-course',
  imports: [CommonModule],
  templateUrl: './delete-course.component.html',
  styleUrl: './delete-course.component.css',
})
export class DeleteCourseComponent implements OnInit {
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
  selectedDeleteCourseId: string | null = null;
  selectedDeleteCourse: string = 'Choose Course to delete';
  allCourses: any = [];
  deleteCourseSuccess: boolean = false;
  isDeletingCourse: boolean = false;

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

  setSelectedDeleteCourse(Course: any) {
    this.selectedDeleteCourseId = Course._id;
    this.selectedDeleteCourse = Course.title;
  }
  deleteCourse() {
    if (!this.selectedDeleteCourseId) return;
    this.isDeletingCourse = true;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );
    this._HttpClient
      .delete(`http://localhost:3000/course/${this.selectedDeleteCourseId}`, {
        headers,
      })
      .subscribe({
        next: () => {
          this.isDeletingCourse = false;

          this.isNotificationSuccess = true;
          this.notificationMessage = 'Course deleted successfully!';
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);

          this.selectedDeleteCourse = 'Choose Course to delete';
          this.selectedDeleteCourseId = null;
        },
        error: () => {
          this.deleteCourseSuccess = false;
          this.isDeletingCourse = false;
          this.isNotificationSuccess = false;
          this.notificationMessage = 'Error deleting course.';
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
        },
      });
  }
}
