import { AuthService } from './../../core/services/auth.service';
import { UserService } from './../../core/services/user.service';
import { FinalTestFeedbacksComponent } from './../final-test-feedbacks/final-test-feedbacks.component';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubscribedCoursesComponent } from '../subscribed-courses/subscribed-courses.component';
import { AssignmentFeedbacksComponent } from '../assignment-feedbacks/assignment-feedbacks.component';
@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    CommonModule,
    SubscribedCoursesComponent,
    FinalTestFeedbacksComponent,
    AssignmentFeedbacksComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: any = {};
  updatedUsername: string = '';
  updatedEmail: string = '';
  updatedScore?: number;
  message: string = '';
  isEditing: boolean = false;
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private _UserService: UserService, private _AuthService: AuthService) {
    effect(() => {
      const role = this._AuthService.role();
      this.isAdmin = role === 'Admin';
      this.isInstructor = role === 'Instructor';
      this.imagePreview = this._UserService.profileImage();
    });
  }

  ngOnInit(): void {
    const decodedToken = this._AuthService.getDecodedToken();
    if (decodedToken) {
      this.user = decodedToken;
      this.updatedUsername = this.user.username || '';
      this.updatedEmail = this.user.email || '';
    } else {
      this.user = { username: '', email: '' };
    }

    this.updatedScore = this._UserService.score();
    this.user.score = this.updatedScore;
  }

  updateUserData() {
    const body = {
      email: this.updatedEmail,
      username: this.updatedUsername,
    };

    this._UserService.updateUserData(body).subscribe({
      next: (res) => {
        this.message = res.message;
        localStorage.setItem('token', res.token);
        this.user.username = this.updatedUsername;
        this.user.email = this.updatedEmail;
        this.user.score = this.updatedScore;

        this._UserService.setEmail(this.updatedEmail);
        this._UserService.setName(this.updatedUsername);
        this.isEditing = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'Update failed';
      },
    });
  }

  setImagePreview(imagePreview: any) {
    this.imagePreview = imagePreview;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('profile', file);

      this._UserService.uploadProfilePic(formData).subscribe({
        next: (res) => {
          this._UserService.setProfileImage(res.user.profile_pic.secure_url);
          this.imagePreview = this._UserService.profileImage();
        },
      });
    }
  }
}
