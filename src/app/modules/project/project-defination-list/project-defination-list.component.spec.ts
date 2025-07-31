import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDefinationListComponent } from './project-defination-list.component';

describe('ProjectDefinationListComponent', () => {
  let component: ProjectDefinationListComponent;
  let fixture: ComponentFixture<ProjectDefinationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectDefinationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDefinationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
