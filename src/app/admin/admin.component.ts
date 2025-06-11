import { AuthService } from './../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
} from '@angular/forms';
import {
  Observable,
  catchError,
  firstValueFrom,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  constructor(
    private _HttpClient: HttpClient,
    private _AuthService: AuthService
  ) { }
  Token: any;
  allUsers: any[] = [];
  notificationMessage: string = '';
  IsNotificationVisible: boolean = false;
  isNotificationSuccess: boolean = false;
  isUsersLoading = true; // <-- Added loading indicator for users
  ngOnInit(): void {
    this.Token = this._AuthService.getToken();

    this.getAllUsers().subscribe({
      next: (response) => {
        this.allUsers = response.allUsers; // Store users for the table
        this.isUsersLoading = false; // Set loading to false when users are loaded
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.notificationMessage = 'Error fetching users.';
        this.isNotificationSuccess = false;
        this.IsNotificationVisible = true;
        setTimeout(() => {
          this.IsNotificationVisible = false;
        }, 3000);
      },
    });
  }

  AddCourse = new FormGroup({
    price: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required),
    Description: new FormControl(null, Validators.required),
  });
  imagePreview: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;
  videoPreview: string | ArrayBuffer | null = null;

  AddCourseSubmit() {
    const courseData = {
      price: this.AddCourse.value.price,
      title: this.AddCourse.value.title,
      description: this.AddCourse.value.Description,
      schedules: this.schedules,
    };
    console.log('Course Data:', courseData);
    this.addCourse(courseData).subscribe({
      next: (response) => {
        this.isNotificationSuccess = true;
        this.notificationMessage = 'Course added successfully!';
        this.IsNotificationVisible = true;
        setTimeout(() => {
          this.IsNotificationVisible = false;
        }, 3000);
        const courseId = response.courseId;
        this.AddImageToCourse(courseId, this.selectedImageFile!).subscribe({
          next: (imageResponse) => {
            this.isNotificationSuccess = true;
            this.notificationMessage = 'Image added successfully!';
            this.IsNotificationVisible = true;
            setTimeout(() => {
              this.IsNotificationVisible = false;
            }, 3000);

            this.imagePreview = null; // Reset the image preview
            this.selectedImageFile = null; // Reset the selected file
            this.AddCourse.reset();
          },
          error: (error) => {
            this.notificationMessage = 'Error adding image to course.';
            this.isNotificationSuccess = false;
            this.IsNotificationVisible = true;
            setTimeout(() => {
              this.IsNotificationVisible = false;
            }, 3000);
          },
        });
      },
      error: (error) => {
        this.notificationMessage = 'Error adding course.';
        this.isNotificationSuccess = false;
        this.IsNotificationVisible = true;
        setTimeout(() => {
          this.IsNotificationVisible = false;
        }, 3000);
      },
    });
  }

  postSchedule(schedule: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );
    return this._HttpClient.post(
      'http://localhost:3000/schedule/',
      { schedule },
      { headers }
    );
  }

  addCourse(courseData: any): Observable<any> {
    const headers = { Authorization: `Bearer ${this.Token}` };
    return this._HttpClient.post('http://localhost:3000/course/', courseData, {
      headers,
    });
  }
  AddImageToCourse(courseId: string, imageFile: File): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('courseimage', imageFile);
    return this._HttpClient.post(
      'http://localhost:3000/course/courseCover',
      formData,
      { headers }
    );
  }
  getAllUsers(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );
    return this._HttpClient.get('http://localhost:3000/user/allUsers', {
      headers,
    });
  }
  DeleteUser(user: any) {
    const headers = { Authorization: `Bearer ${this.Token}` };
    return this._HttpClient
      .delete('http://localhost:3000/user/deleteUser', {
        body: { userId: user._id },
        headers,
      })
      .subscribe({
        next: (response) => {
          this.notificationMessage = 'User deleted successfully!';
          this.isNotificationSuccess = true;
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
          this.allUsers = this.allUsers.filter((item) => item !== user);
        },
        error: (error) => {
          this.notificationMessage = 'Error deleting user.';
          this.isNotificationSuccess = false;
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
        },
      });
  }

  allCourses: any = [];
  isCourseListLoading: boolean = true;
  isListShown: boolean = false;
  isDayListShown: boolean = false;

  show_hideDayList() {
    this.isDayListShown = !this.isDayListShown;
  }

  Days: string[] = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  // time =new FormGroup({
  //   time: new FormControl(null, Validators.required)
  // });
  time: string = 'Select Time';

  SetTime($event: any) {
    this.time = $event.target.value;
  }
  Day: any = 'Select Day';

  SetDay(day: string) {
    this.Day = day;
  }
  convertTo12Hour(time24: string): string {
    if (!time24) return '';
    let [hour, minute] = time24.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // 0 => 12
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }
  schedules: any[] = [];
  AddSchedule() {
    this.time = this.convertTo12Hour(this.time);
    let schedule = { day: this.Day, time: this.time };
    console.log(schedule);
    this.schedules.push(schedule);
    this.time = 'Select Time';
    this.Day = 'Select Day';
  }
  removeScheduleItem(index: number) {
    this.schedules.splice(index, 1);
  }

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
  selectedCourse: any = 'Choose Course';
  selectedCourseId: any = null;
  setSelectedCourse(Course: any) {
    this.selectedCourse = Course.title;
    this.selectedCourseId = Course._id;
  }
  AddLesson = new FormGroup({
    courseId: new FormControl(this.selectedCourseId, Validators.required),
    LessonTitle: new FormControl(null, Validators.required),
    LessonDescription: new FormControl(null, Validators.required),
  });
  isLoading: boolean = false;
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

  removeSchedule() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );
  }
  onImageFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // If you want to handle video file selection separately, add this method:
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
  selectedFile: File | null = null;
  selectedVedioFile: File | null = null;

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

  assignmentForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    dueDate: new FormControl(null, Validators.required),
  });
  onAssignmentSelected(event: Event) {
    const input = event.target as HTMLInputElement;
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
  isList2Shown: boolean = false;
  getAllcourses2() {
    this.isList2Shown = !this.isList2Shown;
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
  selectedFinalTestFile: File | null = null;

  onFinalTestSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFinalTestFile = input.files[0];
      console.log('Selected Final Test File:', this.selectedFinalTestFile);
    }
  }

  isList3Shown: boolean = false;

  getAllcourses3() {
    this.isList3Shown = !this.isList3Shown;
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
  selectedCourseForFinalTest: string = 'Choose Course for Final Test';
  selectedCourseForFinalTestId: string | null = null;
  setSelectedCourseForFinalTest(Course: any) {
    this.selectedCourseForFinalTest = Course.title;
    this.selectedCourseForFinalTestId = Course._id;
  }

  AddFinalTest() {
    if (!this.selectedCourseForFinalTest || !this.selectedCourseForFinalTestId) {
      this.notificationMessage = 'Please select a course and a PDF file.';
      this.isNotificationSuccess = false;
      this.IsNotificationVisible = true;
      setTimeout(() => {
        this.IsNotificationVisible = false;
      }, 3000);
      return;
    }

    if (!this.selectedFinalTestFile) {
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
      this.notificationMessage = 'Only PDF files are allowed.';
      this.isNotificationSuccess = false;
      this.IsNotificationVisible = true;
      setTimeout(() => {
        this.IsNotificationVisible = false;
      }, 3000);
      return;
    }

    console.log('Uploading file:', {
      file: this.selectedFinalTestFile,
      courseId: this.selectedCourseForFinalTestId
    });

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
          console.log('Upload successful:', res);
          this.isNotificationSuccess = true;
          this.notificationMessage = 'Final test uploaded successfully!';
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
          this.selectedFinalTestFile = null;
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.isNotificationSuccess = false;
          this.notificationMessage = err.error?.message || 'Error uploading final test.';
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
        },
      });
  }
  selectedDeleteCourseId: string | null = null;
  selectedDeleteCourse: string = 'Choose Course to delete';

  deleteCourseSuccess: boolean = false;
  isDeletingCourse: boolean = false;

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
