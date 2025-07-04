import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesubmissionComponent } from './candidatesubmission.component';

describe('CandidatesubmissionComponent', () => {
  let component: CandidatesubmissionComponent;
  let fixture: ComponentFixture<CandidatesubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatesubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatesubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
