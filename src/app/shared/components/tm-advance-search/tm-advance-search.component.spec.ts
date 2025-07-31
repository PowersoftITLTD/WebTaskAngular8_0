import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAdvanceSearchComponent } from './tm-advance-search.component';

describe('TmAdvanceSearchComponent', () => {
  let component: TmAdvanceSearchComponent;
  let fixture: ComponentFixture<TmAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TmAdvanceSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TmAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
