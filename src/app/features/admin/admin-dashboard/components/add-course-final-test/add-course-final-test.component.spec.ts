import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseFinalTestComponent } from './add-course-final-test.component';

describe('AddCourseFinalTestComponent', () => {
  let component: AddCourseFinalTestComponent;
  let fixture: ComponentFixture<AddCourseFinalTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourseFinalTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCourseFinalTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
