import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailUiComponent } from './email-ui.component';

describe('EmailUiComponent', () => {
  let component: EmailUiComponent;
  let fixture: ComponentFixture<EmailUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
