import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterPowerComponent } from './monster-power.component';

describe('MonsterPowerComponent', () => {
  let component: MonsterPowerComponent;
  let fixture: ComponentFixture<MonsterPowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterPowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
