import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksTimelineComponent } from './tasks-timeline.component';

describe('TasksTimelineComponent', () => {
  let component: TasksTimelineComponent;
  let fixture: ComponentFixture<TasksTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
