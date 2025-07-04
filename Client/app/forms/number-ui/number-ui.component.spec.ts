import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberUiComponent } from './number-ui.component';

describe('NumberUiComponent', () => {
  let component: NumberUiComponent;
  let fixture: ComponentFixture<NumberUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
