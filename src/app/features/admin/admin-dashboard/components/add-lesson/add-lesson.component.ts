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
  private _CoursesService=inject(CoursesService)

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
    courseId: new FormControl(this.selectedCourseId, Validators.required),
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


  AddLessonSubmit() {
    this.isLoading = true;

    const lessonData = {
      courseId: this.AddLesson.get('courseId')?.value ?? this.selectedCourseId,
      LessonTitle: this.AddLesson.get('LessonTitle')?.value,
      LessonDescription: this.AddLesson.get('LessonDescription')?.value,
    };

    this._AdminService.addLessonWithMedia(lessonData, this.selectedVedioFile, this.selectedFile)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.isNotificationSuccess = true;
          this.notificationMessage = res.message;
          this.IsNotificationVisible = true;
          setTimeout(() => (this.IsNotificationVisible = false), 3000);
          this.AddLesson.reset();
          this.selectedCourse = 'Choose Course';
          this.selectedCourseId = null;
          this.videoPreview = null;
          this.selectedFile = null;
          this.selectedVedioFile = null;
          this.assignmentForm.reset();
        },
        error: () => {
          this.isNotificationSuccess = false;
          this.notificationMessage = 'Error adding lesson.';
          this.IsNotificationVisible = true;
          setTimeout(() => (this.IsNotificationVisible = false), 3000);
        },
      });
  }

}
