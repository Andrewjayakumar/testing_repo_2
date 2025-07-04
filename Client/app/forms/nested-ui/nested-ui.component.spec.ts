import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedUiComponent } from './nested-ui.component';

describe('NestedUiComponent', () => {
  let component: NestedUiComponent;
  let fixture: ComponentFixture<NestedUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
