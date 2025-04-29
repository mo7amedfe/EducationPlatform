import { Router, RouterLink } from '@angular/router';
import { UserService } from './../user.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from './../password-match.validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private _UserService: UserService, private _Router: Router) { }
  errorMessage: any = null;
  RegisterForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
    ]),
    cPassword: new FormControl(null, [
      Validators.required
    ]),
    username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    gender: new FormControl(null, [
      Validators.required
    ])
  }
    //  , { validators: passwordMatchValidator('password', 'rePassword') }
  );
  isRegisterSuccessful:boolean = false;
  regiser() {

    // logic here
    this._UserService.Register(this.RegisterForm.value).subscribe({
      next: (data) => {
        console.log(data);
        console.log('done');
        this.isRegisterSuccessful=true;

      }, error: (err) => {
        console.log(err);
        this.errorMessage = err
      },
    })

  }

}
