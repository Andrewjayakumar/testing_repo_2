import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCalcUiComponent } from './group-calc-ui.component';

describe('GroupCalcUiComponent', () => {
  let component: GroupCalcUiComponent;
  let fixture: ComponentFixture<GroupCalcUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCalcUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCalcUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
