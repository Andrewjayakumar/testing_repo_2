import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOptionUiComponent } from './card-option-ui.component';

describe('CardOptionUiComponent', () => {
  let component: CardOptionUiComponent;
  let fixture: ComponentFixture<CardOptionUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardOptionUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardOptionUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
