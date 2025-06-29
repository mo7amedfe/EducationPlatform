import { UserService } from './../../../core/services/user.service';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private _UserService: UserService, private _Router: Router) {}

  errorMessage: string | null = null;
  isRegisterSuccessful = false;

  RegisterForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'
      ),
    ]),
    cPassword: new FormControl(null, [Validators.required]),
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    gender: new FormControl(null, [Validators.required]),
  });

  register() {
    if (this.RegisterForm.invalid) return;

    this._UserService.Register(this.RegisterForm.value).subscribe({
      next: () => {
        this.isRegisterSuccessful = true;
        this.errorMessage=null;
        this.RegisterForm.reset();
      },
      error: (err) => {
        if (err.error.errors) {
          // لو من نوع validation array
          this.errorMessage = err.error.errors[0] || 'Validation error';
        } else if (err.error.message) {
          // لو من نوع custom زي "Email is already exist"
          this.errorMessage = err.error.message;
        } else {
          // fallback
          this.errorMessage = 'Something went wrong';
        }
      },
    });
  }
}
