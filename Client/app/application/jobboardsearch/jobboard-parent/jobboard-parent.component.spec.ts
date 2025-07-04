import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobboardParentComponent } from './jobboard-parent.component';

describe('JobboardParentComponent', () => {
  let component: JobboardParentComponent;
  let fixture: ComponentFixture<JobboardParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobboardParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobboardParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
