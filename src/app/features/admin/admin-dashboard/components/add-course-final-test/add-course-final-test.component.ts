import { CoursesService } from './../../../../../core/services/courses.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-add-course-final-test',
  imports: [CommonModule],
  templateUrl: './add-course-final-test.component.html',
  styleUrl: './add-course-final-test.component.css',
})
export class AddCourseFinalTestComponent {
  private _CoursesService=inject(CoursesService) 
  private _AdminService=inject(AdminService) 


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



    const formData = new FormData();
    formData.append('finalTestFile', this.selectedFinalTestFile);

    this._AdminService.addFinalTest(this.selectedCourseForFinalTestId,formData).subscribe({
        next: (res) => {
          console.log("done");
          console.log(res);        
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
