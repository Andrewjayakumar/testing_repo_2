import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerUiComponent } from './datepicker-ui.component';

describe('DatepickerUiComponent', () => {
  let component: DatepickerUiComponent;
  let fixture: ComponentFixture<DatepickerUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
