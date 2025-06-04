import { AuthService } from './../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) { }
  Token: any;
  allUsers: any[] = [];

  ngOnInit(): void {
    this.Token = this._AuthService.getToken();

    this.getAllUsers().subscribe({
      next: (response) => {
        this.allUsers = response.allUsers; // Store users for the table
        console.log(this.allUsers);
        
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    })

  }

  AddCourse = new FormGroup({
    price: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required),
    Description: new FormControl(null, Validators.required),
  })
  imagePreview: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;
  onFileSelected(event: Event): void {
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
  AddCourseSubmit() {

    const courseData = {
      price: this.AddCourse.value.price,
      title: this.AddCourse.value.title,
      description: this.AddCourse.value.Description,
    };

    this.addCourse(courseData).subscribe({
      next: (response) => {
        console.log('Course added successfully:', response);
        const courseId = response.courseId
        this.AddImageToCourse(courseId, this.selectedImageFile!).subscribe({
          next: (imageResponse) => {
            console.log('Image added successfully:', imageResponse);
            this.imagePreview = null; // Reset the image preview
            this.selectedImageFile = null; // Reset the selected file
            this.AddCourse.reset();

          },
          error: (error) => {
            console.error('Error adding image to course:', error);
          }
        })

      },
      error: (error) => {
        console.error('Error adding course:', error);
      }

    });


  }

  DeleteUser(userId:any) {
  
  }

  addCourse(courseData: any): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.Token}` };
    return this._HttpClient.post('http://localhost:3000/course/', courseData, { headers });
  }
  AddImageToCourse(courseId: string, imageFile: File): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.Token}`);
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('courseimage', imageFile);
    return this._HttpClient.post('http://localhost:3000/course/courseCover', formData, { headers });
  }
  getAllUsers(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.Token}`);
    return this._HttpClient.get('http://localhost:3000/user/allUsers', { headers });
  }

}