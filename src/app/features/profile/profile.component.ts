import { AuthService } from './../../core/services/auth.service';
import { UserService } from './../../core/services/user.service';
import { FinalTestFeedbacksComponent } from './../final-test-feedbacks/final-test-feedbacks.component';
import { Component, inject, OnInit } from '@angular/core';
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
  updatedScore: Number | undefined;
  message: string = '';
  isEditing: boolean = false;

  private _UserService = inject(UserService);
  private _AuthService = inject(AuthService);

  ngOnInit(): void {
    this._AuthService.isAdmin$.subscribe((state) => {
      if (state) {
        this.isAdmin = true;
      } else {
        this._AuthService.isInstructor$.subscribe((state) => {
          if (state) {
            this.isInstructor = true;
          }
        });
      }
    });
    const decodedToken = this._AuthService.getDecodedToken();
    if (decodedToken) {
      this.user = decodedToken;
      this.updatedUsername = this.user.username;
      this.updatedEmail = this.user.email;
    } else {
      this.user = { username: '', email: '' };
    }
    this._UserService.$profileImage.subscribe({
      next: (res) => {
        this.setImagePreview(res);
      },
    });

    this._UserService.$score.subscribe((state) => {
      this.updatedScore = state;
      this.user.score = state;
    });
  }
  isAdmin: boolean = false;
  isInstructor: boolean = false;

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
        this._UserService.setEmail(this.updatedEmail);
        this._UserService.setname(this.updatedUsername);
        this.user.email = this.updatedEmail;
        this.user.score = this.updatedScore;
        console.log(this.user);
        this.isEditing = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'Update failed';
      },
    });
  }

  imagePreview: string | ArrayBuffer | null = null;

  setImagePreview(imagePreview: any) {
    this.imagePreview = imagePreview;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // ده هيعرض الصورة المختارة بدل القديمة
      };
      reader.readAsDataURL(file);

      // لو عايز ترفع الصورة لسيرفر: send it with FormData
      const formData = new FormData();
      formData.append('profile', file);
      console.log(formData);

      this._UserService.uploadProfilePic(formData).subscribe({
        next: (res) => {
          this._UserService.setProfileImage(res.user.profile_pic.secure_url);

          this._UserService.$profileImage.subscribe((url) => {
            this.imagePreview = url;
          });
        },
      });
    }
  }
}
