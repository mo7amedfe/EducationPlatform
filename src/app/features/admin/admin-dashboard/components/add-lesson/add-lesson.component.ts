import { AdminService } from './../../../services/admin.service';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../../../core/services/courses.service';

@Component({
  selector: 'app-add-lesson',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-lesson.component.html',
  styleUrl: './add-lesson.component.css',
})
export class AddLessonComponent {
  private _AdminService = inject(AdminService);
  private _CoursesService = inject(CoursesService);

  isLoading: boolean = false;
  allCourses: any = [];
  isCourseListLoading: boolean = true;
  isListShown: boolean = false;
  notificationMessage: string = '';
  IsNotificationVisible: boolean = false;
  isNotificationSuccess: boolean = false;
  selectedCourse: any = 'Choose Course';
  selectedCourseId: any = null;
  videoPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  selectedVedioFile: File | null = null;

  AddLesson = new FormGroup({
    LessonTitle: new FormControl(null, Validators.required),
    LessonDescription: new FormControl(null, Validators.required),
  });
  assignmentForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    dueDate: new FormControl(null, Validators.required),
  });
  getAllcourses() {
    this.isListShown = !this.isListShown;
    this.isCourseListLoading = true;
    this._CoursesService.getAllcourses().subscribe({
      next: (res) => {
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
  onAssignmentSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  setSelectedCourse(Course: any) {
    this.selectedCourse = Course.title;
    this.selectedCourseId = Course._id;
  }
  onVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedVedioFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.videoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  assignmentData = new FormData();
  AddLessonSubmit() {
    this.isLoading = true;
    if (!this.selectedCourseId) {
      this.isLoading = false;
      this.isNotificationSuccess = false;
      this.notificationMessage = 'please select a course for the lesson.';
      this.IsNotificationVisible = true;
      setTimeout(() => (this.IsNotificationVisible = false), 3000);
      return;
    }
    const lessonData = {
      courseId: this.selectedCourseId,
      LessonTitle: this.AddLesson.get('LessonTitle')?.value,
      LessonDescription: this.AddLesson.get('LessonDescription')?.value,
    };

    this.assignmentData.append(
      'title',
      this.assignmentForm.get('title')?.value ?? ''
    );
    this.assignmentData.append(
      'description',
      this.assignmentForm.get('description')?.value ?? ''
    );
    this.assignmentData.append(
      'dueDate',
      this.assignmentForm.get('dueDate')?.value ?? ''
    );
    if (this.selectedFile) {
      this.assignmentData.append('file', this.selectedFile);
    }
    this._AdminService.createLesson(lessonData).subscribe({
      next: (res) => {
        let newLessonId = res.leason._id;
        this.isNotificationSuccess = true;
        this.notificationMessage = 'Lesson created successfuly.';
        this.IsNotificationVisible = true;
        setTimeout(() => (this.IsNotificationVisible = false), 3000);

        this.addVideoToLesson(newLessonId);
      },
    });
  }

  addAssignmentToLesson(assignmentData: any, lessonId: any) {
    this._AdminService
      .AddAssignmentToLesson(assignmentData, lessonId)
      .subscribe({
        next: (res) => {
          this.isNotificationSuccess = true;
          this.notificationMessage = 'Assignment uploaded successfuly.';
          this.IsNotificationVisible = true;
          setTimeout(() => (this.IsNotificationVisible = false), 3000);
          this.isLoading=false
        },
        error: (err) => {
          this.isNotificationSuccess = false;
          this.notificationMessage = 'Error uploading Assignment.';
          this.IsNotificationVisible = true;
          setTimeout(() => (this.IsNotificationVisible = false), 3000);
          this.isLoading=false
        },
      });
  }
  addVideoToLesson(lessonId: any) {
    if (this.selectedVedioFile) {
      this._AdminService
        .addVideoToLesson(this.selectedVedioFile, lessonId)
        .subscribe({
          next: (res) => {
            this.isNotificationSuccess = true;
            this.notificationMessage = 'Video Uploaded successfuly.';
            this.IsNotificationVisible = true;
            setTimeout(() => (this.IsNotificationVisible = false), 3000);
            if (this.selectedFile) {
              this.addAssignmentToLesson(this.assignmentData,lessonId)
            }else{
              this.isLoading=false
            }
          },
          error: (err) => {
            this.isNotificationSuccess = false;
            this.notificationMessage = 'Error uploading Video.';
            this.IsNotificationVisible = true;
            setTimeout(() => (this.IsNotificationVisible = false), 3000);
            if (this.selectedFile) {
              this.addAssignmentToLesson(this.assignmentData,lessonId)
            }else{
              this.isLoading=false
            }
          },
        });
    }else if(this.selectedFile){
      this.addAssignmentToLesson(this.assignmentData,lessonId)
    }else{
      this.isLoading=false
    }
  }
}
