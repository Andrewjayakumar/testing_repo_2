import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalCardUiComponent } from './cal-card-ui.component';

describe('CalCardUiComponent', () => {
  let component: CalCardUiComponent;
  let fixture: ComponentFixture<CalCardUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalCardUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalCardUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
