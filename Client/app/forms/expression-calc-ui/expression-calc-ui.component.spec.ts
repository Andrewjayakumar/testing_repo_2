import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionCalcUiComponent } from './expression-calc-ui.component';

describe('ExpressionCalcUiComponent', () => {
  let component: ExpressionCalcUiComponent;
  let fixture: ComponentFixture<ExpressionCalcUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressionCalcUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionCalcUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
