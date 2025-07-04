import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinMailComponent } from './linkedin-mail.component';

describe('LinkedinMailComponent', () => {
  let component: LinkedinMailComponent;
  let fixture: ComponentFixture<LinkedinMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedinMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
