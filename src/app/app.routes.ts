import { instructorGuard } from './core/guards/instructor.guard';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { AdminComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { SubscribedCoursesComponent } from './features/subscribed-courses/subscribed-courses.component';
import { EnrolledCourseDataComponent } from './features/enrolled-course-data/enrolled-course-data.component';
import { CourseFinalTestComponent } from './features/enrolled-course-data/course-final-test/course-final-test.component';
import { StudentsAssignmentsComponent } from './features/review/students-assignments/students-assignments.component';
import { ProfileComponent } from './features/profile/profile.component';
import { PlacementTestComponent } from './features/placement-test/placement-test.component';
import { CourseDetailesComponent } from './features/course-detailes/course-detailes.component';
import { AdminCoursesComponent } from './features/admin/admin-courses/admin-courses.component';
import { InstructorDashboardComponent } from './features/instructor/instructor-dashboard/instructor-dashboard.component';

export const routes: Routes = [

  {
    path: '',component:LandingComponent
  },


  {
    path: 'login',component:LoginComponent
  },
  {
    path: 'register',component:RegisterComponent
  },

  {
    path: 'home',component:HomeComponent,canActivate:[authGuard]
  },

    {
      path: 'Cart',component:CartComponent,canActivate:[authGuard]
    },


  {
    path: 'subscribed-courses',component:SubscribedCoursesComponent,canActivate:[authGuard]
  },
  {
    path: 'subscribed-courses/:id',component:EnrolledCourseDataComponent,canActivate:[authGuard]
  },
  {
    path: 'courseFinalTest/:id',component:CourseFinalTestComponent,canActivate:[authGuard]
  },

  {
    path: 'profile',component:ProfileComponent,canActivate:[authGuard]
    
  },
    {
      path: 'PlacementTest',component:PlacementTestComponent,canActivate:[authGuard]
    },
  {
    path: 'courses/:id',component:CourseDetailesComponent
  },
  {
    path: 'admin',component:AdminComponent,canActivate:[authGuard,adminGuard]
  },

  {
    path: 'studentsAssignments',component:StudentsAssignmentsComponent,canActivate:[authGuard,instructorGuard]
  },
  
  {
    path: 'courses',component:AdminCoursesComponent,canActivate:[authGuard,instructorGuard]
  },

  {
    path: 'instructorDashboard',component:InstructorDashboardComponent,canActivate:[authGuard,instructorGuard]
  },


  {
    path: '**',
    redirectTo: 'home',
  },
];
