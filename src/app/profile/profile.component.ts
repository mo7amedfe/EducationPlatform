import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SubscribedCoursesComponent } from "../subscribed-courses/subscribed-courses.component";

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, SubscribedCoursesComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {};
  updatedUsername: string = '';
  updatedEmail: string = '';
  updatedScore: Number | undefined;
  message: string = '';
  isEditing: boolean = false

  constructor(private _AuthService: AuthService, private _UserService: UserService) { }

  ngOnInit(): void {

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
        this.setImagePreview(res)
      }
    })

    this._UserService.$score.subscribe((state) => {
      this.updatedScore = state
      this.user.score = state
    })
  }

  updateUserData() {
    const body = {
      email: this.updatedEmail,
      username: this.updatedUsername
    };

    this._UserService.updateUserData(body).subscribe({
      next: (res) => {
        this.message = res.message;
        localStorage.setItem("token", res.token)
        this.user.username = this.updatedUsername;
        this._UserService.setEmail(this.updatedEmail)
        this._UserService.setname(this.updatedUsername)
        this.user.email = this.updatedEmail;
        this.user.score = this.updatedScore;
        console.log(this.user);


        this.isEditing = false
      },
      error: (err) => {
        this.message = err.error?.message || 'Update failed';
      }
    })
  }

  imagePreview: string | ArrayBuffer | null = null;

  setImagePreview(imagePreview: any) {
    this.imagePreview = imagePreview
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

          this._UserService.$profileImage.subscribe((url) => { this.imagePreview = url })
        }
      })
    }
  }
}
