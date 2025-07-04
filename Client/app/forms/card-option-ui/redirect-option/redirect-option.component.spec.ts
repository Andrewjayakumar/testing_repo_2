import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectOptionComponent } from './redirect-option.component';

describe('RedirectOptionComponent', () => {
  let component: RedirectOptionComponent;
  let fixture: ComponentFixture<RedirectOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
