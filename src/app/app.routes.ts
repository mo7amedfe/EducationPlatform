import { AdminComponent } from './features/admin/admin/admin.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing Page (before login)
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },

  // Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // Home (after login)
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  // Cart
    {
      path: 'Cart',
      loadComponent: () =>
        import('./features/cart/cart.component').then((m) => m.CartComponent),
    },

  //   Admin Page (contains inner components)
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
  },

  // Subscribed Courses
  {
    path: 'subscribed-courses',
    loadComponent: () =>
      import('./features/subscribed-courses/subscribed-courses.component').then(
        (m) => m.SubscribedCoursesComponent
      ),
  },
  {
    path: 'subscribed-courses/:id',
    loadComponent: () =>
      import(
        './features/enrolled-course-data/enrolled-course-data.component'
      ).then((m) => m.EnrolledCourseDataComponent),
  },
  {
    path: 'courseFinalTest/:id',
    loadComponent: () =>
      import(
        './features/enrolled-course-data/course-final-test/course-final-test.component'
      ).then((m) => m.CourseFinalTestComponent),
  },

  // Review (for instructors)
  {
    path: 'studentsAssignments',
    loadComponent: () =>
      import(
        './features/review/students-assignments/students-assignments.component'
      ).then((m) => m.StudentsAssignmentsComponent),
  },

  // Profile
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
    {
      path: 'PlacementTest',
      loadComponent: () =>
        import('./features/placement-test/placement-test.component').then((m) => m.PlacementTestComponent),
    },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/course-detailes/course-detailes.component').then(
        (m) => m.CourseDetailesComponent
      ),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/admin/admin-courses/admin-courses.component').then(
        (m) => m.AdminCoursesComponent
      ),
  },
  //   {
  //     path: 'profile/final-feedback',
  //     loadComponent: () =>
  //       import('./features/profile/final-feedback/final-feedback.component').then((m) => m.FinalFeedbackComponent),
  //   },

  // Fallback route (404)
  {
    path: '**',
    redirectTo: '',
  },
];

// 🛠️ لو بتستخدم bootstrapApplication
