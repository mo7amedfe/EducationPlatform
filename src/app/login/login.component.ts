import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private _UserService: UserService, private _Router: Router, private _AuthService: AuthService) { }

  LoginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
    ])
  })

  login() {
    this._UserService.Login(this.LoginForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this._Router.navigate(['/home'])
        const token = data.userToken;
        localStorage.setItem('token', token);
        this._AuthService.setIsLogin(true)
        this._UserService.setScore(token.score)
      }, error(err) {
        console.log(err);
      },
    })

  }
}
