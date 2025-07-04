import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarUiComponent } from './progress-bar-ui.component';

describe('ProgressBarUiComponent', () => {
  let component: ProgressBarUiComponent;
  let fixture: ComponentFixture<ProgressBarUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressBarUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
