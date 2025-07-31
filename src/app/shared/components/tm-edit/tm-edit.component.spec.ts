import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmEditComponent } from './tm-edit.component';

describe('TmEditComponent', () => {
  let component: TmEditComponent;
  let fixture: ComponentFixture<TmEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TmEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
