import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginresponseComponent } from './loginresponse.component';

describe('LoginresponseComponent', () => {
  let component: LoginresponseComponent;
  let fixture: ComponentFixture<LoginresponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginresponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
