import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderUiComponent } from './calender-ui.component';

describe('CalenderUiComponent', () => {
  let component: CalenderUiComponent;
  let fixture: ComponentFixture<CalenderUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalenderUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
