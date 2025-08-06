import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalAuthorityTableComponent } from './approval-authority-table.component';

describe('ApprovalAuthorityTableComponent', () => {
  let component: ApprovalAuthorityTableComponent;
  let fixture: ComponentFixture<ApprovalAuthorityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalAuthorityTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalAuthorityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
