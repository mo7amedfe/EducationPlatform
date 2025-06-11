import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseDataService } from '../course-data.service';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-enrolled-course-data',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './enrolled-course-data.component.html',
  styleUrl: './enrolled-course-data.component.css',
})
export class EnrolledCourseDataComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  courseId: string = '';
  courseData: any = {
    courseName: '',
    courseDescription: '',
    courseImage: { secure_url: '' },
    courselessons: [],
  };
  selectedLesson: any = null;
  selectedFile: File | null = null;
  uploadMessage: string = '';

  isLoading = true;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _CourseDataService: CourseDataService,
    private _AuthService: AuthService,
    private _HttpClient: HttpClient
  ) {}
  Student_ID: any;
  ngOnInit(): void {
    const token =
      this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


    this.Student_ID = this._AuthService.getDecodedToken()?._id || '';
    this.courseId = this._ActivatedRoute.snapshot.params['id'];
    this._CourseDataService.getCourseData(this.courseId).subscribe((res) => {
      console.log(res);
      
      this.courseData = res;
      if (this.courseData.courselessons.length > 0) {
        this.selectedLesson = this.courseData.courselessons[0];
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
     
  }

 selectLesson(lesson: any) {
  this.selectedLesson = lesson;
  console.log('Selected lesson:', this.selectedLesson);
  
        this.selectedFile = null; // Reset selected file when changing lesson
        this.uploadMessage = ''; // Reset upload message when changing lesson
        if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
 

}


  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.uploadMessage = '';
    }
  }

  onAssignmentUpload() {
    if (!this.selectedFile || !this.selectedLesson) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Example: get token from AuthService or localStorage
    const token =
      this._AuthService.getToken?.() || localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.uploadMessage = 'Uploading...';

    this._HttpClient
      .post(
        `http://localhost:3000/submittedAssignment/${this.selectedLesson._id}/submissions`,
        formData,
        { headers }
      )
      .subscribe({
        next: (res: any) => {
          this.uploadMessage = 'Assignment uploaded successfully!';
          this.selectedFile = null;
          console.log(res);
          console.log(this.selectedLesson.submissions);
          this.selectedLesson.submissions.push(res.submission);
        },
        error: (err) => {
          this.uploadMessage = 'Upload failed. Please try again.';
          console.error(err);
        },
      });
  }

  startFinalTest() {
    // Navigate to the final test page or open a modal
    // Example: this.router.navigate(['/final-test', this.courseId]);
    alert('Final Course Test will start!');
  }

  getAssignment() {
    if (!this.selectedLesson) return;

    this._CourseDataService.getLessonAssignment(this.selectedLesson._id).subscribe((blob: Blob) => {
    const contentDisposition = 'attachment; filename=assignment.pdf'; // ممكن تجيب الاسم من الـ header في backend لو حبيت

    const fileName = 'assignment.pdf'; // أو تاخده من الـ Content-Disposition header لو عايز ديناميكي

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  });
  }
  downloadSubmission(submission_id: string) {
    if (!this.selectedLesson) return;
    // Example: get token from AuthService or localStorage
    const token =
      this._AuthService.getToken?.() || localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this._HttpClient
      .get(
        `http://localhost:3000/submittedAssignment/my-submissions/${submission_id}/download`,
        { headers, responseType: 'blob' }
      )
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response]);
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `submission_${submission_id}.pdf`; // You can adjust the filename/extension as needed
          a.click();

          URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading submission:', err);
          alert('Failed to download submission. Please try again later.');
        },
      });
  }
}
