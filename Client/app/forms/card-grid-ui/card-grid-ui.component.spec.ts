import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGridUiComponent } from './card-grid-ui.component';

describe('CardGridUiComponent', () => {
  let component: CardGridUiComponent;
  let fixture: ComponentFixture<CardGridUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardGridUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardGridUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
