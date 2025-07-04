import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateMatchingComponent } from './candidate-matching.component';

describe('CandidateMatchingComponent', () => {
  let component: CandidateMatchingComponent;
  let fixture: ComponentFixture<CandidateMatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
