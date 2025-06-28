import { AdminService } from './../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css',
})
export class AddCourseComponent {
  private _AdminService = inject(AdminService);

  isLoading: boolean = false;
  isDayListShown: boolean = false;
  notificationMessage: string = '';
  IsNotificationVisible: boolean = false;
  isNotificationSuccess: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;
  schedules: any = [];
  Days: string[] = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  time: string = 'Select Time';

  AddCourse = new FormGroup({
    price: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required),
    Description: new FormControl(null, Validators.required),
  });

  AddCourseSubmit() {
    this.isLoading = true;

    const courseData = {
      price: this.AddCourse.value.price,
      title: this.AddCourse.value.title,
      description: this.AddCourse.value.Description,
      schedules: this.schedules,
    };

    this._AdminService.addCourse(courseData).subscribe({
      next: (response) => {
        this.isNotificationSuccess = true;
        this.notificationMessage = 'Course added successfully!';
        this.IsNotificationVisible = true;
        setTimeout(() => {
          this.IsNotificationVisible = false;
        }, 3000);
        const courseId = response.courseId;
        this._AdminService.AddImageToCourse(courseId, this.selectedImageFile!).subscribe({
          next: (imageResponse) => {
            this.isLoading = false;
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
            this.isLoading = false;
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
        this.isLoading = false;
        this.notificationMessage = 'Error adding course.';
        this.isNotificationSuccess = false;
        this.IsNotificationVisible = true;
        setTimeout(() => {
          this.IsNotificationVisible = false;
        }, 3000);
      },
    });
  }

  SetTime($event: any) {
    console.log($event);

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

  show_hideDayList() {
    this.isDayListShown = !this.isDayListShown;
  }

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
}
