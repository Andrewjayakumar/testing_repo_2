import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCandidateSearchComponent } from './new-candidate-search.component';

describe('NewCandidateSearchComponent', () => {
  let component: NewCandidateSearchComponent;
  let fixture: ComponentFixture<NewCandidateSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCandidateSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCandidateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
