import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Autocomplete2UiComponent } from './autocomplete2-ui.component';

describe('Autocomplete2UiComponent', () => {
  let component: Autocomplete2UiComponent;
  let fixture: ComponentFixture<Autocomplete2UiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Autocomplete2UiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Autocomplete2UiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
