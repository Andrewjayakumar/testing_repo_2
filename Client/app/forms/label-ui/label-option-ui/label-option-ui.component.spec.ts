import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelOptionUiComponent } from './label-option-ui.component';

describe('LabelOptionUiComponent', () => {
  let component: LabelOptionUiComponent;
  let fixture: ComponentFixture<LabelOptionUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelOptionUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelOptionUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
