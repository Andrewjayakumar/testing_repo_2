import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedInpopupComponent } from './linkedinpopup.component';

describe('LinkedinpopupComponent', () => {
    let component: LinkedInpopupComponent;
    let fixture: ComponentFixture<LinkedInpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [LinkedInpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedInpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
