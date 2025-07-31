import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmTabsComponent } from './tm-tabs.component';

describe('TmTabsComponent', () => {
  let component: TmTabsComponent;
  let fixture: ComponentFixture<TmTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TmTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TmTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
