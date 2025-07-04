import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWizardUiComponent } from './form-wizard-ui.component';

describe('FormWizardUiComponent', () => {
  let component: FormWizardUiComponent;
  let fixture: ComponentFixture<FormWizardUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormWizardUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWizardUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
