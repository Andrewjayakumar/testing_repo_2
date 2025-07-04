import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureCandidateComponent } from './secure-candidate.component';

describe('SecureCandidateComponent', () => {
  let component: SecureCandidateComponent;
  let fixture: ComponentFixture<SecureCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecureCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
