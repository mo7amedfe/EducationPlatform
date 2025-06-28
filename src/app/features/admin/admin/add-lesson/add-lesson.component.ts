import { AuthService } from './../../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-lesson',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-lesson.component.html',
  styleUrl: './add-lesson.component.css',
})
export class AddLessonComponent {
  constructor(
    private _AuthService: AuthService,
    private _HttpClient: HttpClient
  ) {}
  ngOnInit(): void {
    this.Token = this._AuthService.getToken();
  }
  Token: any;
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
    return this._HttpClient.get('http://localhost:3000/course/').subscribe({
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
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadAssignment(lessonId: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );
    const formData = new FormData();
    formData.append('title', this.assignmentForm.value.title ?? '');
    formData.append('description', this.assignmentForm.value.description ?? '');
    formData.append('dueDate', this.assignmentForm.value.dueDate ?? '');
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    return this._HttpClient.post(
      `http://localhost:3000/leason/${lessonId}/assignment`,
      formData,
      { headers }
    );
  }
  uploadVideo(lessonId: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );
    const formData = new FormData();
    formData.append('video', this.selectedVedioFile!);

    return this._HttpClient.post(
      `http://localhost:3000/leason/${lessonId}/video`,
      formData,
      { headers }
    );
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
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );

    const lessonData = {
      courseId: this.selectedCourseId,
      LessonTitle: this.AddLesson.value.LessonTitle,
      LessonDescription: this.AddLesson.value.LessonDescription,
    };

    let createdLessonId: string;

    this._HttpClient
      .post('http://localhost:3000/leason/', lessonData, { headers })
      .pipe(
        switchMap((response: any) => {
          this.isLoading = false;
          console.log('Lesson added:', response);

          createdLessonId = response.leason._id;
          console.log('Lesson ID:', createdLessonId);

          // Upload video if selected
          if (this.selectedVedioFile) {
            this.isLoading = true;
            return this.uploadVideo(createdLessonId).pipe(
              tap((videoResponse) => {
                this.isLoading = false;
                console.log('Video uploaded:', videoResponse);
              }),
              catchError((error) => {
                this.isLoading = false;
                console.error('Error uploading video:', error);
                return of(null); // Continue even if upload fails
              })
            );
          }
          return of(null);
        }),
        switchMap(() => {
          // Upload assignment if selected
          if (this.selectedFile) {
            this.isLoading = true;
            return this.uploadAssignment(createdLessonId).pipe(
              tap((assignmentResponse) => {
                this.isLoading = false;
                console.log('Assignment uploaded:', assignmentResponse);
              }),
              catchError((error) => {
                this.isLoading = false;
                console.error('Error uploading assignment:', error);
                return of(null); // Continue even if upload fails
              })
            );
          }
          return of(null);
        })
      )
      .subscribe({
        next: () => {
          this.isNotificationSuccess = true;
          this.notificationMessage = 'Lesson added successfully!';
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);

          this.AddLesson.reset();
          this.selectedCourse = 'Choose Course';
          this.selectedCourseId = null;
        },
        error: () => {
          this.isLoading = false;
          this.isNotificationSuccess = false;
          this.notificationMessage = 'Error adding lesson.';
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
        },
      });
  }
}
