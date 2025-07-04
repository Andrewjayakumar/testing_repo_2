import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dropdown2UiComponent } from './dropdown2-ui.component';

describe('Dropdown2UiComponent', () => {
  let component: Dropdown2UiComponent;
  let fixture: ComponentFixture<Dropdown2UiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dropdown2UiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dropdown2UiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
