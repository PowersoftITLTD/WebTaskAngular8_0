import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmTreeViewComponent } from './tm-tree-view.component';

describe('TmTreeViewComponent', () => {
  let component: TmTreeViewComponent;
  let fixture: ComponentFixture<TmTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TmTreeViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
