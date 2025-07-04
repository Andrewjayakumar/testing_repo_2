import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiolistUiComponent } from './radiolist-ui.component';

describe('RadiolistUiComponent', () => {
  let component: RadiolistUiComponent;
  let fixture: ComponentFixture<RadiolistUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiolistUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiolistUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
