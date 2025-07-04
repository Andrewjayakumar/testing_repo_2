import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineUiComponent } from './timeline-ui.component';

describe('TimelineUiComponent', () => {
  let component: TimelineUiComponent;
  let fixture: ComponentFixture<TimelineUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
