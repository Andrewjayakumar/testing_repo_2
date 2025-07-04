import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedChildUiComponent } from './nested-child-ui.component';

describe('NestedChildUiComponent', () => {
  let component: NestedChildUiComponent;
  let fixture: ComponentFixture<NestedChildUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedChildUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedChildUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
