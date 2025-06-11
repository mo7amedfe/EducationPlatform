import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFinalTestComponent } from './course-final-test.component';

describe('CourseFinalTestComponent', () => {
  let component: CourseFinalTestComponent;
  let fixture: ComponentFixture<CourseFinalTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFinalTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseFinalTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
