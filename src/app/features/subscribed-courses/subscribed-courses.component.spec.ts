import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedCoursesComponent } from './subscribed-courses.component';

describe('SubscribedCoursesComponent', () => {
  let component: SubscribedCoursesComponent;
  let fixture: ComponentFixture<SubscribedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribedCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
