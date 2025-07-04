import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceGridUiComponent } from './advance-grid-ui.component';

describe('AdvanceGridUiComponent', () => {
  let component: AdvanceGridUiComponent;
  let fixture: ComponentFixture<AdvanceGridUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceGridUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceGridUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
