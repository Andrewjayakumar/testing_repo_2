import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridUiComponent } from './grid-ui.component';

describe('GridUiComponent', () => {
  let component: GridUiComponent;
  let fixture: ComponentFixture<GridUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
