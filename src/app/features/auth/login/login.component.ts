import { AuthService } from './../../../core/services/auth.service';
import { UserService } from './../../../core/services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  errorMessage: string | null = null;

  constructor(private _UserService: UserService, private _Router: Router, private _AuthService: AuthService) {}

  LoginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
    ])
  });

  login() {
    this.errorMessage = null;
    this._UserService.Login(this.LoginForm.value).subscribe({
      next: (res) => {
        const token = res.userToken;
        localStorage.setItem('token', token);
        this._AuthService.setIsLogin(true);
        this._UserService.setScore(res.score);
        this._Router.navigate(['/home']);
     
      },
      error: (err) => {
        if (Array.isArray(err.error?.errors)) {
          this.errorMessage = err.error.errors.map((e: any) => e.msg).join(', ');
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}
