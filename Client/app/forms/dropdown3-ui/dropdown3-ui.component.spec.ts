import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dropdown3UiComponent } from './dropdown3-ui.component';

describe('Dropdown3UiComponent', () => {
  let component: Dropdown3UiComponent;
  let fixture: ComponentFixture<Dropdown3UiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dropdown3UiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dropdown3UiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
