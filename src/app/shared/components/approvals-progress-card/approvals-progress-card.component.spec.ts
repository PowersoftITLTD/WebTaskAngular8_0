import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsProgressCardComponent } from './approvals-progress-card.component';

describe('ApprovalsProgressCardComponent', () => {
  let component: ApprovalsProgressCardComponent;
  let fixture: ComponentFixture<ApprovalsProgressCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsProgressCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalsProgressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
