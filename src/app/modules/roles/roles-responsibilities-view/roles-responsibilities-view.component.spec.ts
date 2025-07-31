import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesResponsibilitiesViewComponent } from './roles-responsibilities-view.component';

describe('RolesResponsibilitiesViewComponent', () => {
  let component: RolesResponsibilitiesViewComponent;
  let fixture: ComponentFixture<RolesResponsibilitiesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolesResponsibilitiesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesResponsibilitiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
