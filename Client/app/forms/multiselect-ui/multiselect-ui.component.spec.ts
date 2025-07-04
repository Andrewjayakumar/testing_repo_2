import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectUiComponent } from './multiselect-ui.component';

describe('MultiselectUiComponent', () => {
    let component: MultiselectUiComponent;
    let fixture: ComponentFixture<MultiselectUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [MultiselectUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(MultiselectUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
