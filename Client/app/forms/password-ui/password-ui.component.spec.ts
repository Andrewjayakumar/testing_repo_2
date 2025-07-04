import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordUiComponent } from './password-ui.component';

describe('PasswordUiComponent', () => {
  let component: PasswordUiComponent;
  let fixture: ComponentFixture<PasswordUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
