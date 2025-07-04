import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxUiComponent } from './checkbox-ui.component';

describe('CheckboxUiComponent', () => {
  let component: CheckboxUiComponent;
  let fixture: ComponentFixture<CheckboxUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
