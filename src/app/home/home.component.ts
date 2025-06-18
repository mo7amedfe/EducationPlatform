import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';
import { CoursesComponent } from "../courses/courses.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // لاحظ أن هذا هو الصحيح (styleUrls وليس styleUrl)
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
