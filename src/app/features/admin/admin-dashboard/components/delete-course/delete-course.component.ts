import { AdminService } from './../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CoursesService } from '../../../../../core/services/courses.service';

@Component({
  selector: 'app-delete-course',
  imports: [CommonModule],
  templateUrl: './delete-course.component.html',
  styleUrl: './delete-course.component.css',
})
export class DeleteCourseComponent {

private _AdminService=inject(AdminService)
private _CoursesService=inject(CoursesService)


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
    this._CoursesService.getAllcourses().subscribe({
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
 
    this._AdminService.deleteCourse(this.selectedDeleteCourseId).subscribe({
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
