import { CourseDataService } from './../../core/services/course-data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    private _CourseDataService: CourseDataService
  ) {}

  ngOnInit(): void {
    this.courseId = this._ActivatedRoute.snapshot.params['id'];
    this._CourseDataService.getCourseData(this.courseId).subscribe({
      next: (res: any) => {
        console.log(res);

        this.courseData = res;
        if (this.courseData.courselessons.length > 0) {
          this.selectedLesson = this.courseData.courselessons[0];
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  selectLesson(lesson: any) {
    this.selectedLesson = lesson;
    this.selectedFile = null;
    this.uploadMessage = '';
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

    this.uploadMessage = 'Uploading...';

    let selectedLessonId = this.selectedLesson._id;

    this._CourseDataService
      .uploadAssignment(selectedLessonId, formData)
      .subscribe({
        next: (res: any) => {
          this.uploadMessage = 'Assignment uploaded successfully!';
          this.selectedFile = null;

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

    this._CourseDataService
      .getLessonAssignment(this.selectedLesson._id)
      .subscribe((blob: Blob) => {
        const contentDisposition = 'attachment; filename=assignment.pdf';

        const fileName = 'assignment.pdf';

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
    this._CourseDataService.dowmloadSubmission(submission_id).subscribe({
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
