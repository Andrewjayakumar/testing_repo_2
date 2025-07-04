import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorUiComponent } from './calculator-ui.component';

describe('CalculatorUiComponent', () => {
  let component: CalculatorUiComponent;
  let fixture: ComponentFixture<CalculatorUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
