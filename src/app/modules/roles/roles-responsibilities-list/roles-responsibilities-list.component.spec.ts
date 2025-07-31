import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesResponsibilitiesListComponent } from './roles-responsibilities-list.component';

describe('RolesResponsibilitiesListComponent', () => {
  let component: RolesResponsibilitiesListComponent;
  let fixture: ComponentFixture<RolesResponsibilitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolesResponsibilitiesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesResponsibilitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
