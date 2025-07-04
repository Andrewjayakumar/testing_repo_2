import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelUiComponent } from './label-ui.component';

describe('LabelUiComponent', () => {
  let component: LabelUiComponent;
  let fixture: ComponentFixture<LabelUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
