import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUiComponent } from './card-ui.component';

describe('CardUiComponent', () => {
  let component: CardUiComponent;
  let fixture: ComponentFixture<CardUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
