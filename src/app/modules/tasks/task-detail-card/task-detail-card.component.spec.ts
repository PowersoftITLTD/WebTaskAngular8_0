import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailCardComponent } from './task-detail-card.component';

describe('TaskDetailCardComponent', () => {
  let component: TaskDetailCardComponent;
  let fixture: ComponentFixture<TaskDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
