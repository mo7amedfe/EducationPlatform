import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CoursesComponent } from "../courses/courses.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-landing',
  imports: [CoursesComponent , FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private _Router: Router) {}
  formData = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit() {
    console.log('Form Data:', this.formData);
    // هنا تقدر تبعت البيانات لسيرفر أو تعمل أي حاجة
    alert('Thanks for contacting us!');
  }
  login() {
    this._Router.navigate(['/login'])

  }
  register() {
    this._Router.navigate(['/register'])

  }
}
