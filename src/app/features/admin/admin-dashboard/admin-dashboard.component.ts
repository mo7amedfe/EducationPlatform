import { Component } from '@angular/core';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { AddLessonComponent } from './components/add-lesson/add-lesson.component';
import { AddCourseFinalTestComponent } from './components/add-course-final-test/add-course-final-test.component';
import { DeleteCourseComponent } from './components/delete-course/delete-course.component';


@Component({
  selector: 'app-admin',
  imports: [ AllUsersComponent, AddCourseComponent, AddLessonComponent, AddCourseFinalTestComponent, DeleteCourseComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminComponent {
}
