import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumesJournalsComponent } from './resumes-journals.component';

describe('ResumesJournalsComponent', () => {
  let component: ResumesJournalsComponent;
  let fixture: ComponentFixture<ResumesJournalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumesJournalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumesJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
