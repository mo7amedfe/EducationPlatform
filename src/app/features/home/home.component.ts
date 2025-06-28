
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CoursesComponent } from "../courses/courses.component";
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  ,
  imports: [CommonModule, CoursesComponent]
})
export class HomeComponent implements OnInit {
  user: any = {};
 
  constructor(private _AuthService: AuthService) { }


  ngOnInit(): void {
    const decodedToken = this._AuthService.getDecodedToken();
    if (decodedToken != null) {
      this.user = decodedToken;
    } else {
      this.user.username = ''
    }
  }
}
