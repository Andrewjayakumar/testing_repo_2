import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxlistUiComponent } from './checkboxlist-ui.component';

describe('CheckboxlistUiComponent', () => {
  let component: CheckboxlistUiComponent;
  let fixture: ComponentFixture<CheckboxlistUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxlistUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxlistUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
