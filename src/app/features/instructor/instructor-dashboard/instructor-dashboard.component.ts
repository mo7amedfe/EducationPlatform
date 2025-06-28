import { Component } from '@angular/core';
import { AddCourseComponent } from "../../admin/admin-dashboard/components/add-course/add-course.component";
import { AddLessonComponent } from "../../admin/admin-dashboard/components/add-lesson/add-lesson.component";
import { AddCourseFinalTestComponent } from "../../admin/admin-dashboard/components/add-course-final-test/add-course-final-test.component";

@Component({
  selector: 'app-instructor-dashboard',
  imports: [AddCourseComponent, AddLessonComponent, AddCourseFinalTestComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.css'
})
export class InstructorDashboardComponent {

}
