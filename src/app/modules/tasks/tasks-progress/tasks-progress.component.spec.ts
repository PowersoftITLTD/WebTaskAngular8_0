import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksProgressComponent } from './tasks-progress.component';

describe('TasksProgressComponent', () => {
  let component: TasksProgressComponent;
  let fixture: ComponentFixture<TasksProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
