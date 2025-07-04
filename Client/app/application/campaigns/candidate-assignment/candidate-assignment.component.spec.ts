import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAssignmentComponent } from './candidate-assignment.component';

describe('CandidateAssignmentComponent', () => {
  let component: CandidateAssignmentComponent;
  let fixture: ComponentFixture<CandidateAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
