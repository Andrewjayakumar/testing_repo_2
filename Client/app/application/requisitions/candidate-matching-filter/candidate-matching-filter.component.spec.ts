import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateMatchingFilterComponent } from './candidate-matching-filter.component';

describe('CandidateMatchingFilterComponent', () => {
  let component: CandidateMatchingFilterComponent;
  let fixture: ComponentFixture<CandidateMatchingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateMatchingFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateMatchingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
