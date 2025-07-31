import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovalComponent } from './add-approval.component';

describe('AddApprovalComponent', () => {
  let component: AddApprovalComponent;
  let fixture: ComponentFixture<AddApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
