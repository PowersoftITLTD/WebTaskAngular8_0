import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesResponsibilitiesAddComponent } from './roles-responsibilities-add.component';

describe('RolesResponsibilitiesAddComponent', () => {
  let component: RolesResponsibilitiesAddComponent;
  let fixture: ComponentFixture<RolesResponsibilitiesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolesResponsibilitiesAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesResponsibilitiesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
